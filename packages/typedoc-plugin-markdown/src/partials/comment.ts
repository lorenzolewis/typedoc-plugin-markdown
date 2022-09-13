import { Comment } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme-context';
import { camelToTitleCase } from '../utils';
import { bold } from '../els';

export function comment(context: MarkdownThemeRenderContext, comment: Comment) {
  const md: string[] = [];

  if (comment.summary?.length > 0) {
    md.push(context.partials.commentParts(comment.summary));
  }

  if (comment.blockTags?.length) {
    const tags = comment.blockTags
      .filter((tag) => tag.tag !== '@returns')
      .map((tag) => {
        switch (tag.tag) {
          case '@since':
            return `${bold(
              camelToTitleCase(tag.tag.substring(1)),
            )}: ${context.partials.commentParts(tag.content)}`;
          case '@history':
            const history: string[] = [];
            history.push('<details>');
            history.push(
              `<summary>${camelToTitleCase(tag.tag.substring(1))}</summary>`,
            );
            history.push(context.partials.commentParts(tag.content));
            history.push('</details>');
            return history.join('\n\n');
          default:
            return `${bold(
              camelToTitleCase(tag.tag.substring(1)),
            )}\n\n${context.partials.commentParts(tag.content)}`;
        }
      });
    md.push(tags.join('\n\n'));
  }

  return md.join('\n\n');
}
