// config/brand.ts
export const brandConfig = {
  name: 'GenXCode',
  shortName: 'GXC',
  description: 'An exclusive, invite-only Elite Tech Club & Learning Management System',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  theme: {
    colors: {
      primary: '#0D1232',
      secondary: '#0F1333',
      accent: '#FCB27E',
      background: '#FFFFFF',
      surface: '#F1E9E6',
    },
    fonts: {
      heading: 'Times New Roman, serif',
      body: 'var(--font-google-sans), sans-serif',
    }
  },
  socials: {
    github: '[https://github.com/GenXCode](https://github.com/GenXCode)',
    linkedin: '[https://linkedin.com/company/genxcode](https://linkedin.com/company/genxcode)',
  },
  emails: {
    support: 'cosmolix.in@gmail.com',
    admin: 'ofc.genxcode@gmail.com', // As per your schema definition
  }
} as const;

export type BrandConfig = typeof brandConfig;