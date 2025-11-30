import './sui-storybook-h2.scss';

/**
 * Replace element with our custom override to get rid of
 * default styles from Storybook and allow us to customize things further
 */
export const SuiStorybookH2 = ({ children, className = '' }) => {
  const id = children.toLowerCase().split(' ').join('-');

  return <h2 className={`sui-storybook-h2 ${className}`} id={id}>{children}</h2>;
};

export default SuiStorybookH2;
