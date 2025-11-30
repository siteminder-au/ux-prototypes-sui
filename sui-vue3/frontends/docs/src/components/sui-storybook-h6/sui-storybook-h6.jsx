import './sui-storybook-h6.scss';

/**
 * Replace element with our custom override to get rid of
 * default styles from Storybook and allow us to customize things further
 */
export const SuiStorybookH6 = ({ children, className = ''}) => {
  const id = children.toLowerCase().split(' ').join('-');

  return <h6 className={`sui-storybook-h6 ${className}`} id={id}>{children}</h6>;
};

export default SuiStorybookH6;
