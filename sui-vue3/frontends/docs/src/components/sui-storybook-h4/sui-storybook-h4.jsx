import './sui-storybook-h4.scss';

/**
 * Replace element with our custom override to get rid of
 * default styles from Storybook and allow us to customize things further
 */
export const SuiStorybookH4 = ({ children, className = ''}) => {
  const id = children.toLowerCase().split(' ').join('-');

  return <h4 className={`sui-storybook-h4 ${className}`} id={id}>{children}</h4>;
};

export default SuiStorybookH4;
