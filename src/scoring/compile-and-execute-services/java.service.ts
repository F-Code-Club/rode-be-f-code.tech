import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { BeResultDto } from '@scoring/dtos/be-result.dto';

@Injectable()
export class JavaService {
  constructor(
    @Inject('SCORING_PATH')
    private scoringPath: string,
  ) {}

  compileAndExecute(
    code: string,
    testCases: {
      input: string;
      output: string;
    }[],
  ): [BeResultDto, any] {
    const [id, err] = this.compile(code);
    if (err) {
      return [null, err];
    }
    return this.execute(id, testCases);
  }

  compile(code: string) {
    let compileErr = null;
    const id = randomUUID();
    fs.mkdirSync(path.resolve(this.scoringPath + `/${id}`));
    fs.writeFileSync(
      path.resolve(this.scoringPath + `/${id}/${id}.java`),
      code,
    );
    try {
      cp.execSync(
        `javac ${path.resolve(this.scoringPath + `/${id}/${id}.java`)}`,
      );
    } catch (err) {
      compileErr = err.message;
    }

    fs.unlinkSync(path.resolve(this.scoringPath + `/${id}/${id}.java`));
    return [id, compileErr];
  }

  execute(
    id: string,
    testCases: {
      input: string;
      output: string;
    }[],
  ): [BeResultDto, any] {
    const testCaseStatistics = [];
    let totalTime = 0;
    try {
      for (const testCase of testCases) {
        const t1 = performance.now();
        const result = cp.execSync(
          `java -cp ${path.resolve(this.scoringPath + `/${id}`)} Main`,
          { input: testCase.input },
        );
        const t2 = performance.now();
        const dt = t2 - t1;
        testCaseStatistics.push(
          result.toString().trim() == testCase.output.trim(),
        );
        totalTime += dt;
      }
    } catch (err) {
      return [null, err.message];
    }

    if (fs.existsSync(path.resolve(this.scoringPath + `/${id}`))) {
      fs.rmSync(path.resolve(this.scoringPath + `/${id}`), { recursive: true });
    }

    return [
      {
        passedTestCases: testCaseStatistics.filter(Boolean).length,
        allTestCases: testCases.length,
        execTime: totalTime,
      },
      null,
    ];
  }
}
