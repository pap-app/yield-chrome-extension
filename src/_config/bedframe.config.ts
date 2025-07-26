import { createBedframe } from '@bedframe/core'
import { chrome } from '../manifests/chrome'

export default createBedframe({
  browser: [
    chrome.browser
  ],
  extension: {
    type: 'overlay',options: 'full-page',manifest: [chrome],
    pages: {
overlay: 'src/pages/main.html',
    },    
  },
  development: {
    template: {
      config: {
        framework: 'react',
        language: 'typescript',
        packageManager: 'pnpm',
        style: {
          framework: 'tailwind',
          components: 'shadcn',
          theme: 'new-york',
          fonts: [
            {
              name: 'Inter',
              local: 'Inter',
              src: './assets/fonts/inter/*.ttf',
              weights: {
                'Inter-Regular': 400,
                'Inter-SemiBold': 600,
                'Inter-Bold': 700,
                'Inter-ExtraBold': 800,
              },
            },
          ],
        },
        lintFormat: true,
        git: true,
gitHooks: true,
commitLint: true,
changesets: true,
  
      },
    },
  },
})




