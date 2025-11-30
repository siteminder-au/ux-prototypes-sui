import './sui-storybook-table.scss';

export const SuiStorybookTable = ({ children, className = '' }) => {
  return <table className={`sui-storybook-table ${className}`}>{children}</table>;
};

export default SuiStorybookTable;
