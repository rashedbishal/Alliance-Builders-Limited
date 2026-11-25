import LegalPageContent from '@/components/LegalPageContent';

interface Props {
    title: string;
    content: string;
}

const PrivacyPolicy = ({ title, content }: Props) => (
    <LegalPageContent title={title} content={content} />
);

export default PrivacyPolicy;
