import { createTheme } from '@mui/material'

import { rgbToHexString } from '@/functions/util'

const exoFont = {
  fontFamily: 'Exo',
  fontStyle: 'normal',
  fontWeight: 400,
  src: `url(fonts/Exo.ttf) format("truetype")`,
}

const bitterFont = {
  fontFamily: 'Bitter',
  fontStyle: 'normal',
  fontWeight: 400,
  src: `url(fonts/Bitter.ttf) format("truetype")`,
}

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html': [
          { '@font-face': exoFont },
          { '@font-face': bitterFont },
        ],
        'html, body, #root': { height: '100%' },
        '#root': { display: 'flex', flexDirection: 'column' },
      },
    },
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: rgbToHexString([243, 243, 247]),
          paper: rgbToHexString([255, 255, 255]),
        },
        text: {
          primary: rgbToHexString([39, 40, 56]),
          secondary: rgbToHexString([39, 40, 56]),
        },
        primary: {
          main: rgbToHexString([95, 116, 171]),
          contrastText: rgbToHexString([255, 255, 255]),
        },
        secondary: {
          main: rgbToHexString([244, 238, 205]),
          contrastText: rgbToHexString([39, 40, 56]),
        },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        background: {
          default: rgbToHexString([39, 40, 56]),
          paper: rgbToHexString([20, 33, 61]),
        },
        text: {
          primary: rgbToHexString([255, 255, 255]),
          secondary: rgbToHexString([255, 255, 255]),
        },
        primary: {
          main: rgbToHexString([95, 116, 171]),
          contrastText: rgbToHexString([255, 255, 255]),
        },
        secondary: {
          main: rgbToHexString([202, 209, 227]),
          contrastText: rgbToHexString([39, 40, 56]),
        },
      },
    },
  },
  shape: { borderRadius: 4 },
  spacing: 8,
  typography: {
    fontFamily: exoFont.fontFamily,
    fontSize: 16,
    body1: { fontFamily: exoFont.fontFamily, fontSize: '1rem', fontWeight: 'normal', lineHeight: 1.5, textTransform: 'inherit' },
    body2: { fontFamily: exoFont.fontFamily, fontSize: '0.87rem', fontWeight: 'normal', lineHeight: 1.5, textTransform: 'inherit' },
    subtitle1: { fontFamily: exoFont.fontFamily, fontSize: '0.87rem', fontWeight: 'normal', lineHeight: 1.5, textTransform: 'inherit' },
    subtitle2: { fontFamily: exoFont.fontFamily, fontSize: '0.56rem', fontWeight: 'normal', lineHeight: 1.5, textTransform: 'inherit' },
    h1: { fontFamily: bitterFont.fontFamily, fontSize: '2.00rem', fontWeight: 'bold', lineHeight: 1.5, textTransform: 'inherit' },
    h2: { fontFamily: bitterFont.fontFamily, fontSize: '1.74rem', fontWeight: 'bold', lineHeight: 1.5, textTransform: 'inherit' },
    h3: { fontFamily: bitterFont.fontFamily, fontSize: '1.52rem', fontWeight: 'bold', lineHeight: 1.5, textTransform: 'inherit' },
    h4: { fontFamily: bitterFont.fontFamily, fontSize: '1.32rem', fontWeight: 'bold', lineHeight: 1.5, textTransform: 'inherit' },
    h5: { fontFamily: bitterFont.fontFamily, fontSize: '1.15rem', fontWeight: 'bold', lineHeight: 1.5, textTransform: 'inherit' },
    h6: { fontFamily: bitterFont.fontFamily, fontSize: '1rem', fontWeight: 'bold', lineHeight: 1.5, textTransform: 'inherit' },
    button: { fontFamily: exoFont.fontFamily, fontSize: '1rem', fontWeight: 'normal', lineHeight: 1.5, textTransform: 'inherit' },
    overline: { fontFamily: exoFont.fontFamily, fontSize: '0.56rem', fontWeight: 'bold', lineHeight: 1, textTransform: 'uppercase' },
    caption: { fontFamily: exoFont.fontFamily, fontSize: '0.87rem', fontWeight: 'normal', lineHeight: 1.5, textTransform: 'inherit' },
  },
})
