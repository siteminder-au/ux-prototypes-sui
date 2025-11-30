import SmLoadingTable from '../sm-loading-table.vue'

export default {
  title: 'Components/Loading/Loading table',
  component: SmLoadingTable,
}

export const Standard = () => ({
  components: { SmLoadingTable },
  template: `
    <div>
      <sm-loading-table totalRows="5" totalColumns="5"/>
    </div>
  `,
})
