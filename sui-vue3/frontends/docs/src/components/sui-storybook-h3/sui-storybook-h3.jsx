import './sui-storybook-h3.scss';

/**
 * Replace element with our custom override to get rid of
 * default styles from Storybook and allow us to customize things further
 */
export const SuiStorybookH3 = ({ children, className = ''}) => {
  const id = children.toLowerCase().split(' ').join('-');

  return <h3 className={`sui-storybook-h3 ${className}`} id={id}>{children}</h3>;
};

export default SuiStorybookH3;
