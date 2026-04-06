import './globals.css';
import SessionProviderClient from '../components/SessionProviderClient';

export const metadata = {
  title: 'NestRank',
  description: 'Score and rank neighborhoods around any address'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <SessionProviderClient>{children}</SessionProviderClient>
      </body>
    </html>
  );
}
