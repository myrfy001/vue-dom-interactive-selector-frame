<template>
  <iframe id="InteractiveDomSelector" :src="url" width= "100%" height= "100%"/>
</template>

<script>

import  { InteractiveSelector } from './injected_code.js'
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    const iframe = document.getElementById('InteractiveDomSelector')
    iframe.onload = function() {
      const document_ = iframe.contentDocument
      const _interactive_dom_selector_stub = new InteractiveSelector(document_)
      document_._interactive_dom_selector_stub = _interactive_dom_selector_stub
    }
  },
  methods: {
    input() {
      console.log('input')
    }
  }
}
</script>
