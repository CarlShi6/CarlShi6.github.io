import { TypographyLab } from './study';

export default function TypographyMotionLabPage() {
  return process.env.NODE_ENV === 'production' ? null : <TypographyLab />;
}
