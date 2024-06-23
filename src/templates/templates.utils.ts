export class TemplatesUtils {
  static extractFileId(url: string) {
    // EX: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    const fileIdPattern = /\/file\/d\/([^\/]+)\//;
    const match = url.match(fileIdPattern);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  }
}
