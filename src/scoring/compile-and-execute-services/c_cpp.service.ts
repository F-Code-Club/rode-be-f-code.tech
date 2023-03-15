import { Inject, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import * as cp from 'child_process';
import { BeResultDto } from '@scoring/dtos/be-result.dto';

@Injectable()
export class C_CPPService {
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
    fs.writeFileSync(path.resolve(this.scoringPath + `/${id}.c`), code);
    try {
      cp.execSync(
        `gcc ${path.resolve(this.scoringPath + `/${id}.c`)} -o ${path.resolve(
          this.scoringPath + `/${id}`,
        )}`,
      );
    } catch (err) {
      compileErr = err.message;
    }
    fs.unlinkSync(path.resolve(this.scoringPath + `/${id}.c`));
    return [id, compileErr];
  }

  execute(
    id: string,
    testCases: {
      input: string;
      output: string;
    }[],
  ): [BeResultDto, any] {
    const testCaseStatistics: boolean[] = [];
    let totalTime = 0;
    try {
      for (const testCase of testCases) {
        const t1 = performance.now();
        const result = cp.execSync(path.resolve(this.scoringPath + `/${id}`), {
          input: testCase.input,
        });
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
      fs.unlinkSync(path.resolve(this.scoringPath + `/${id}`));
    }
    if (fs.existsSync(path.resolve(this.scoringPath + `/${id}.exe`))) {
      fs.unlinkSync(path.resolve(this.scoringPath + `/${id}.exe`));
    }

    return [
      { testCaseStatistics: testCaseStatistics, execTime: totalTime },
      null,
    ];
  }
}
