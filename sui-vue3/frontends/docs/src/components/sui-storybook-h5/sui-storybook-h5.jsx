import './sui-storybook-h5.scss';

/**
 * Replace element with our custom override to get rid of
 * default styles from Storybook and allow us to customize things further
 */
export const SuiStorybookH5 = ({ children, className = ''}) => {
  const id = children.toLowerCase().split(' ').join('-');

  return <h5 className={`sui-storybook-h5 ${className}`} id={id}>{children}</h5>;
};

export default SuiStorybookH5;
