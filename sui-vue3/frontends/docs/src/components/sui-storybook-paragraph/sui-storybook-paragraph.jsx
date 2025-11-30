import './sui-storybook-paragraph.scss';

export const SuiStorybookParagraph = ({ children, className = '' }) => {
  return <p className={`sm-p sui-storybook-paragraph ${className}`}>{children}</p>;
};

export default SuiStorybookParagraph;
