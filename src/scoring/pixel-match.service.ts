import { Injectable } from '@nestjs/common';
import * as pixelmatch from 'pixelmatch';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import { resolve } from 'path';
import { LocalFilesService } from 'templates/local-files.service';
import { PNG } from 'pngjs';
import { FeResultDto } from './dtos/fe-result.dto';
import RodeConfig from '@etc/config';

@Injectable()
export class PixelMatchService {
  constructor(private readonly localFilesService: LocalFilesService) {}

  async score(localFileId: string, html: string): Promise<[FeResultDto, any]> {
    const [localFile, err] = await this.localFilesService.findOneById(
      localFileId,
    );
    if (err) {
      return [null, err];
    }
    const src = fs.readFileSync(
      resolve(__dirname + '/../../' + localFile.path),
    );
    const srcImg = PNG.sync.read(src);
    const srcWidth = srcImg.width;
    const srcHeight = srcImg.height;
    const [target, err2] = await this.renderImage(html, srcWidth, srcHeight);
    if (err2) {
      return [null, err2];
    }
    const [match, err3] = this.compareImageWithTemplate(src, target);
    if (err3) {
      return [null, err3];
    }
    return [{ match: match, coc: html.length }, null];
  }

  async renderImage(
    html: string,
    srcWidth: number,
    srcHeight: number,
  ): Promise<[Buffer, any]> {
    try {
      // const viewport = [800, 600];
      const viewport = [srcWidth, srcHeight];
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--headless',
        ],
        executablePath: RodeConfig.CHROMIUM_PATH,
        dumpio: true,
        defaultViewport: {
          width: viewport[0],
          height: viewport[1],
        },
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pngBuff = await page.screenshot({
        omitBackground: true,
        type: 'png',
      });
      await browser.close();
      return [pngBuff, null];
    } catch (err) {
      console.log(err);
      return [null, err];
    }
  }

  async renderDiffImage(
    localFileId: string,
    html: string,
  ): Promise<[Buffer, any]> {
    const [localFile, err] = await this.localFilesService.findOneById(
      localFileId,
    );
    if (err) {
      return [null, err];
    }
    const src = fs.readFileSync(
      resolve(__dirname + '/../../' + localFile.path),
    );
    const srcImg = PNG.sync.read(src);
    const srcWidth = srcImg.width;
    const srcHeight = srcImg.height;
    const [target, err2] = await this.renderImage(html, srcWidth, srcHeight);
    if (err2) {
      return [null, err2];
    }
    try {
      // const srcImg = PNG.sync.read(src);
      const targetImg = PNG.sync.read(target);
      const diffImg = new PNG({ width: srcImg.width, height: srcImg.height });
      if (
        srcImg.width !== targetImg.width ||
        srcImg.height !== targetImg.height
      ) {
        return [
          null,
          `Images are not the same size. Source image size: ${srcImg.width}x${srcImg.height}`,
        ];
      }
      pixelmatch(
        srcImg.data,
        targetImg.data,
        diffImg.data,
        srcImg.width,
        srcImg.height,
        {
          threshold: 0.1,
        },
      );
      return [PNG.sync.write(diffImg), null];
    } catch (err) {
      console.log(err);
      return [null, err];
    }
  }

  compareImageWithTemplate(src: Buffer, target: Buffer): [number, any] {
    try {
      const path = resolve(__dirname + '/../../css-scoring');
      // fs.writeFileSync(`${path}/src.png`, src);
      // fs.writeFileSync(`${path}/target.png`, target);
      const srcImg = PNG.sync.read(src);
      const targetImg = PNG.sync.read(target);
      const diffImg = new PNG({ width: srcImg.width, height: srcImg.height });
      const misMatch = pixelmatch(
        srcImg.data,
        targetImg.data,
        diffImg.data,
        srcImg.width,
        srcImg.height,
      );
      const match = (1 - misMatch / (srcImg.width * srcImg.height)) * 100;
      return [match, null];
    } catch (err) {
      console.log(err);
      return [null, err];
    }
  }
}
