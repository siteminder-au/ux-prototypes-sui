import './sui-storybook-h1.scss';

/**
 * Replace element with our custom override to get rid of
 * default styles from Storybook and allow us to customize things further
 */
export const SuiStorybookH1 = ({ children, className = ''}) => {
  const id = children.toLowerCase().split(' ').join('-');

  return <h1 className={`sui-storybook-h1 ${className}`} id={id}>{children}</h1>;
};

export default SuiStorybookH1;
