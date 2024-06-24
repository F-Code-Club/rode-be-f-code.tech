export class TemplatesUtils {
  static extractFileId(url: string) {
    // EX: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    const fileIdPattern = /\/file\/d\/([^]+)\//;
    const match = RegExp(fileIdPattern).exec(url);
    if (match[1]) {
      return match[1];
    }
    return null;
  }
}
