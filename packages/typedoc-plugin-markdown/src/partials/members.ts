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

          // Choose which reflection kinds to render a table for
          let reflectionKinds: ReflectionKind[] = [];
          // prettier-ignore
          reflectionKinds = [
            // ReflectionKind.Interface,
            ReflectionKind.Enum
          ];

          let children = group.children;

          if (reflectionKinds.includes(container.kind)) {
            // Pulls out any properties
            const properties = children.filter((item) =>
              [ReflectionKind.Property, ReflectionKind.EnumMember].includes(
                item.kind,
              ),
            );
            // Render properties as a table
            if (properties.length > 0) {
              md.push(context.partials.propertiesTable(properties));
            }

            // Removes any properties from original array as they've already been rendered
            children = children.filter(
              (item) => item.kind !== ReflectionKind.Property,
            );
          } else {
            children
              .filter((item) => !item.hasOwnDocument)
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
