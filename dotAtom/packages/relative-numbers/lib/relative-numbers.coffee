LineNumberView = require './line-number-view'
{CompositeDisposable} = require 'atom'

module.exports =
  # Config schema
  config:
    trueNumberCurrentLine:
      type: 'boolean'
      default: true
      description: 'Show the true number on the current line'
    showAbsoluteNumbers:
      type: 'boolean'
      default: false
      description: 'Show absolute line numbers too?'
    startAtOne:
      type: 'boolean'
      default: false
      description: 'Start relative line numbering at one'

  configDefaults:
    trueNumberCurrentLine: true
    showAbsoluteNumbers: false
    startAtOne: false

  subscriptions: null

  activate: (state) ->
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.workspace.observeTextEditors (editor) ->
      if not editor.gutterWithName('relative-numbers')
        new LineNumberView(editor)

  deactivate: () ->
    @subscriptions.dispose()
    for editor in atom.workspace.getTextEditors()
      editor.gutterWithName('relative-numbers').view?.destroy()
