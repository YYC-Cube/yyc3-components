import { addons } from '@storybook/addons';
import { create } from '@storybook/theme/create';

const theme = create({
  base: 'light',
  brandTitle: 'YYC3 Reusable Components',
  brandUrl: 'https://github.com/YYC-Cube/yyc3-reusable-components',
  brandImage: null,
});

addons.setConfig({
  theme,
});
