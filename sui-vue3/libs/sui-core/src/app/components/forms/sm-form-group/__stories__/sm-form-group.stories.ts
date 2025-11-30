import SmFormGroup from '../sm-form-group.vue'

export default {
  title: 'Components/Form/Group',
  component: SmFormGroup,
}

export const TextInput = () => ({
  components: { SmFormGroup },
  template: `
    <div class="w-256">

      <sm-form>

        <sm-form-group legend="Some fields">
          <sm-input type="text" label="Name" name="name" />
          <sm-input type="text" label="Code" name="code" />
        </sm-form-group>

        <sm-form-group legend="Some more fields">
          <sm-input type="text" label="Foo" name="foo" />
          <sm-input type="text" label="Bar" name="bar" />
        </sm-form-group>

      </sm-form>

    </div>
  `,
})

TextInput.storyName = 'Text Input'
