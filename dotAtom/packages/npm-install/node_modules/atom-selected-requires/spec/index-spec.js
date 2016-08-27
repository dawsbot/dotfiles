const assert   = require('assert')
const Atom     = require('atom')
const selected = require('../')
const fs       = require('fs')

const fixture = require.resolve('./fixture')

describe('atom-selected-packages', function() {
  beforeEach(function() {
    atom.workspace = new atom.workspace.__proto__.constructor
  })

  function openFile(file, fn) {
    return waitsForPromise(function() {
      return atom.workspace
        .open(file)
        .then(function() {
          try {
            fn(atom.workspace.getTextEditors()[0])
          } catch(e) {
            console.error(e)
            throw e
          }
        })
    })
  }

  it('should pick up all required packages', function(done) {
    return openFile(fixture, function(editor) {
      editor.selectAll()

      var selection = editor.getSelectedText()
      var packages  = selected(editor)

      expect(packages[0]).toBe('first')
      expect(packages[1]).toBe('second')
      expect(packages[2]).toBe('third')
      expect(packages[3]).toBe('./fourth')
      expect(packages[4]).toBe('./fifth')
      expect(packages[5]).toBe('./sixth')
      expect(packages[6]).toBe('./seventh')
      expect(packages.length).toBe(7)
    })
  })

  it('should ignore package variable declarations', function(done) {
    return openFile(fixture, function(editor) {
      editor.setSelectedBufferRange([[0, 0], [0, 9]])

      var selection = editor.getSelectedText()
      var packages  = selected(editor)

      expect(packages.length).toBe(0)
    })
  })

  it('should include partial package selections', function(done) {
    return openFile(fixture, function(editor) {
      editor.setSelectedBufferRange([[0, 0], [0, 10]])

      var selection = editor.getSelectedText()
      var packages  = selected(editor)

      expect(packages[0]).toBe('first')
      expect(packages.length).toBe(1)
    })
  })

  it('should include multiple partial package selections', function(done) {
    return openFile(fixture, function(editor) {
      editor.setSelectedBufferRange([[0, 8], [1, 11]])

      var selection = editor.getSelectedText()
      var packages  = selected(editor)

      expect(packages[0]).toBe('first')
      expect(packages[1]).toBe('second')
      expect(packages.length).toBe(2)
    })
  })

  it('should work with multiple selections', function(done) {
    return openFile(fixture, function(editor) {
      editor.setSelectedBufferRanges([
        [[0, 8], [0, 10]],
        [[2, 10], [2, 12]]
      ])

      var packages   = selected(editor)
      var selections = editor.getSelections().map(function(selection) {
        return selection.getText()
      })

      expect(packages[0]).toBe('first')
      expect(packages[1]).toBe('third')
      expect(packages.length).toBe(2)
    })
  })

  it('can select from "import" keyword', function(done) {
    return openFile(fixture, function(editor) {
      editor.setSelectedBufferRanges([
        [[4, 0], [4, 1]]
      ])

      var packages   = selected(editor)
      var selections = editor.getSelections().map(function(selection) {
        return selection.getText()
      })

      expect(packages[0]).toBe('./fourth')
      expect(packages.length).toBe(1)
    })
  })

  it('can select from "import" specifiers', function(done) {
    return openFile(fixture, function(editor) {
      editor.setSelectedBufferRanges([
        [[4, 10], [4, 11]]
      ])

      var packages   = selected(editor)
      var selections = editor.getSelections().map(function(selection) {
        return selection.getText()
      })

      expect(packages[0]).toBe('./fourth')
      expect(packages.length).toBe(1)
    })
  })

  it('can select from "from" keyword', function(done) {
    return openFile(fixture, function(editor) {
      editor.setSelectedBufferRanges([
        [[4, 16], [4, 17]]
      ])

      var packages   = selected(editor)
      var selections = editor.getSelections().map(function(selection) {
        return selection.getText()
      })

      expect(packages[0]).toBe('./fourth')
      expect(packages.length).toBe(1)
    })
  })

  it('can select from "as" keyword', function(done) {
    return openFile(fixture, function(editor) {
      editor.setSelectedBufferRanges([
        [[5, 11], [5, 12]]
      ])

      var packages   = selected(editor)
      var selections = editor.getSelections().map(function(selection) {
        return selection.getText()
      })

      expect(packages[0]).toBe('./fifth')
      expect(packages.length).toBe(1)
    })
  })

  it('can select from "import" strings', function(done) {
    return openFile(fixture, function(editor) {
      editor.setSelectedBufferRanges([
        [[6, 20], [6, 21]]
      ])

      var packages   = selected(editor)
      var selections = editor.getSelections().map(function(selection) {
        return selection.getText()
      })

      expect(packages[0]).toBe('./sixth')
      expect(packages.length).toBe(1)
    })
  })
})
