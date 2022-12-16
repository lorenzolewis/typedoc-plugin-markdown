import { readdirSync, statSync, readFileSync } from 'fs';
import { relative } from 'path';

const getAllMdFilesFromFolder = (dir, relativeTo) => {
  var results: string[] = [];
  readdirSync(dir).forEach((file) => {
    file = dir + '/' + file;
    const stat = statSync(file);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMdFilesFromFolder(file, __dirname));
    } else {
      results.push(relative(relativeTo, file));
      if (file.endsWith('.md')) {
        expect(readFileSync(file, 'utf8')).toMatchSnapshot();
      }
    }
  });

  return results;
};

describe(`Markdown Output Files Structure`, () => {
  test(`should generate same files`, () => {
    expect(
      getAllMdFilesFromFolder(__dirname + '/../../docs/md', __dirname),
    ).toMatchSnapshot();
  });
});
