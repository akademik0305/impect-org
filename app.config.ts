export default defineAppConfig({
  ui: {
    colors: {
      primary: 'main'
    },
    select: {
      slots: {

      },
      variants: {
        variant: {
          outline: "bg-gray-1 ring-0"
        }
      },
      compoundVariants: [
        {
          color: 'primary',
          highlight: true,
          class: 'ring-0 ring-inset ring-primary'
        },
      ]
    }
  },

});
