import LegalPageContent from '@/components/LegalPageContent';

interface Props {
    title: string;
    content: string;
}

const TermsOfService = ({ title, content }: Props) => (
    <LegalPageContent title={title} content={content} />
);

export default TermsOfService;
