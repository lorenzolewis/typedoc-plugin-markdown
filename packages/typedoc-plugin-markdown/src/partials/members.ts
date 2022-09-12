import { ContainerReflection, ReflectionKind } from 'typedoc';
import { heading, horizontalRule } from '../els';
import { getSecondaryHeadingLevel } from '../support/helpers';
import { MarkdownThemeRenderContext } from '../theme-context';

export function members(
  context: MarkdownThemeRenderContext,
  container: ContainerReflection,
) {
  const md: string[] = [];
  if (container.categories && container.categories.length) {
    container.categories
      .filter((category) => !category.allChildrenHaveOwnDocument())
      .forEach((item) =>
        item.children
          .filter((item) => !item.hasOwnDocument)
          .forEach((item) => {
            md.push(context.partials.member(item));
          }),
      );
  } else {
    container.groups
      ?.filter((group) => !group.allChildrenHaveOwnDocument())
      .forEach((group, groupIndex) => {
        const headingLevel = getSecondaryHeadingLevel(container);
        if (group.categories) {
          group.categories.forEach((groupItem) =>
            groupItem.children.forEach((item) => {
              md.push(context.partials.member(item));
            }),
          );
        } else {
          md.push(heading(headingLevel, group.title));
          if (
            [ReflectionKind.Interface, ReflectionKind.Enum].includes(
              container.kind,
            )
          ) {
            md.push(context.partials.propertiesTable(group.children));
          } else {
            // Render properties as a table
            const properties = group.children.filter(
              (item) => item.kind === ReflectionKind.Property,
            );
            if (properties.length > 0) {
              md.push(context.partials.propertiesTable(properties));
            }
            group.children
              .filter(
                (item) =>
                  !item.hasOwnDocument && item.kind != ReflectionKind.Property,
              )
              .forEach((groupChild, index) => {
                md.push(context.partials.member(groupChild));
                if (index !== group.children.length - 1) {
                  md.push(horizontalRule(context));
                }
              });
          }
          if (container.groups && container.groups.length) {
            if (groupIndex !== container.groups.length - 1) {
              md.push(horizontalRule(context));
            }
          }
        }
      });
  }
  return md.join('\n\n');
}
