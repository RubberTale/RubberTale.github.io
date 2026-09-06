import { ThemeConfig } from '../../types';

export function getThemeClasses(theme: ThemeConfig) {
  // Font Family
  const fontClass =
    theme.fontFamily === 'serif'
      ? 'font-serif'
      : theme.fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

  // Font Size
  const fontSizeClass =
    theme.fontSize === 'compact'
      ? 'text-[13px] leading-[1.35]'
      : theme.fontSize === 'comfortable'
      ? 'text-[15px] leading-[1.6]'
      : 'text-[14px] leading-[1.5]';

  // Heading sizes
  const titleSizeClass =
    theme.fontSize === 'compact'
      ? 'text-xl'
      : theme.fontSize === 'comfortable'
      ? 'text-3xl'
      : 'text-2xl';

  const sectionHeadingClass =
    theme.fontSize === 'compact'
      ? 'text-sm'
      : theme.fontSize === 'comfortable'
      ? 'text-lg'
      : 'text-base';

  // Section Gaps
  const sectionGapClass =
    theme.sectionGap === 'compact'
      ? 'space-y-3'
      : theme.sectionGap === 'relaxed'
      ? 'space-y-6'
      : 'space-y-4';

  const itemGapClass =
    theme.sectionGap === 'compact'
      ? 'space-y-2'
      : theme.sectionGap === 'relaxed'
      ? 'space-y-4'
      : 'space-y-3';

  // Paper Padding
  const paddingStyle =
    theme.paperPadding === 'compact'
      ? 'p-6 sm:p-8'
      : theme.paperPadding === 'relaxed'
      ? 'p-10 sm:p-14'
      : 'p-8 sm:p-10';

  return {
    fontClass,
    fontSizeClass,
    titleSizeClass,
    sectionHeadingClass,
    sectionGapClass,
    itemGapClass,
    paddingStyle,
  };
}
