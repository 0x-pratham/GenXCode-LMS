import { brandConfig } from './brand';

export const footerLinks = {
  platform: [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Community', href: '/community' },
    { title: 'Leaderboard', href: '/leaderboard' },
  ],
  legal: [
    { title: 'Privacy Policy', href: '/privacy' },
    { title: 'Terms of Service', href: '/terms' },
  ],
  socials: [
    { title: 'GitHub', href: brandConfig.socials.github },
    { title: 'LinkedIn', href: brandConfig.socials.linkedin },
  ],
};