import tagNameLight1 from './fixtures/tagName1/light.html'
import tagNameShadow1 from './fixtures/tagName1/shadow.html'

describe('getElementsByTagName', () => {
    it('light DOM - handles tag names', () => {
      const tagName1 = "svg";
      const expected1 = [
        {
          tagName: 'svg',
          classList: []
        }
      ]
      withDom(tagNameLight1, context => {
        assertResultEqual(tagName1, context.getElementsByTagName(tagName1), expected1, true)
      })
      const tagName2 = "span";
      const expected2 = [
        {
          tagName: 'SPAN',
          classList: []
        }
      ]
      withDom(tagNameLight1, context => {
        assertResultEqual(tagName2, context.getElementsByTagName(tagName2), expected2, true)
      })
    });

    it('shadow DOM - handles tag names', () => {
      const tagName1 = "svg";
      const expected1 = [
        {
          tagName: 'svg',
          classList: []
        }
      ]
      withDom(tagNameShadow1, context => {
        assertResultEqual(tagName1, getElementsByTagName(tagName1, context), expected1, true)
      })
      const tagName2 = "span";
      const expected2 = [
        {
          tagName: 'SPAN',
          classList: []
        }
      ]
      withDom(tagNameShadow1, context => {
        assertResultEqual(tagName2, getElementsByTagName(tagName2, context), expected2, true)
      })
    });

    it('light DOM - handles wildcards', () => {
      const tagName = "*";
      const expected = [
        {
          tagName: 'HTML',
          classList: []
        },
        {
          tagName: 'HEAD',
          classList: []
        },
        {
          tagName: 'BODY',
          classList: []
        },
        {
          tagName: 'DIV',
          classList: ['container']
        },
        {
          tagName: 'DIV',
          classList: ['outer-component']
        },
        {
          tagName: 'DIV',
          classList: ['wrapper']
        },
        {
          tagName: 'DIV',
          classList: ['inner-component']
        },
        {
          tagName: 'SPAN',
          classList: []
        },
        {
          tagName: 'svg',
          classList: []
        },
        {
          tagName: 'defs',
          classList: []
        },
        {
          tagName: 'linearGradient',
          classList: []
        },
        {
          tagName: 'stop',
          classList: []
        },
        {
          tagName: 'stop',
          classList: []
        },
        {
          tagName: 'circle',
          classList: []
        }
      ]
      withDom(tagNameLight1, context => {
        assertResultEqual(tagName, context.getElementsByTagName(tagName), expected, true)
      })
    });

    it('shadow DOM - handles wildcards', () => {
      const tagName = "*";
      const expected = [
        {
          tagName: 'HEAD',
          classList: []
        },
        {
          tagName: 'BODY',
          classList: []
        },
        {
          tagName: 'DIV',
          classList: ['container']
        },
        {
          tagName: 'OUTER-COMPONENT',
          classList: []
        },
        {
          tagName: 'DIV',
          classList: ['wrapper']
        },
        {
          tagName: 'INNER-COMPONENT',
          classList: []
        },
        {
          tagName: 'SPAN',
          classList: []
        },
        {
          tagName: 'svg',
          classList: []
        },
        {
          tagName: 'defs',
          classList: []
        },
        {
          tagName: 'linearGradient',
          classList: []
        },
        {
          tagName: 'stop',
          classList: []
        },
        {
          tagName: 'stop',
          classList: []
        },
        {
          tagName: 'circle',
          classList: []
        },
        {
          tagName: 'SCRIPT',
          classList: []
        }
      ]
      withDom(tagNameShadow1, context => {
        assertResultEqual(tagName, getElementsByTagName(tagName, context), expected, true)
      })
    });

    it('light DOM - is case insensitive', () => {
      const tagName = "SpAn";
      const expected = [
        {
          tagName: 'SPAN',
          classList: []
        }
      ]
      withDom(tagNameLight1, context => {
        assertResultEqual(tagName, context.getElementsByTagName(tagName), expected, true)
      })
    });

    it('shadow DOM - is case insensitive', () => {
      const tagName = "SpAn";
      const expected = [
        {
          tagName: 'SPAN',
          classList: []
        }
      ]
      withDom(tagNameShadow1, context => {
        assertResultEqual(tagName, getElementsByTagName(tagName, context), expected, true)
      })
    });
  })

  describe('getElementsByTagNameNS', () => {
    it('light DOM - returns empty with falsy ns', () => {
      
    });

    it('shadow DOM - returns empty with falsy ns', () => {
      
    });

    it('light DOM - returns ns matches', () => {
      const tagName = '*';
      const namespace = 'http://www.w3.org/2000/svg';
      const expected = [
        {
          tagName: 'svg',
          classList: []
        },
        {
          tagName: 'defs',
          classList: []
        },
        {
          tagName: 'linearGradient',
          classList: []
        },
        {
          tagName: 'stop',
          classList: []
        },
        {
          tagName: 'stop',
          classList: []
        },
        {
          tagName: 'circle',
          classList: []
        }
      ]
      withDom(tagNameLight1, context => {
        assertResultEqual(tagName, context.getElementsByTagNameNS(namespace, tagName), expected, true)
      })
    });

    it('shadow DOM - returns ns matches', () => {
      const tagName = '*';
      const namespace = 'http://www.w3.org/2000/svg';
      const expected = [
        {
          tagName: 'svg',
          classList: []
        },
        {
          tagName: 'defs',
          classList: []
        },
        {
          tagName: 'linearGradient',
          classList: []
        },
        {
          tagName: 'stop',
          classList: []
        },
        {
          tagName: 'stop',
          classList: []
        },
        {
          tagName: 'circle',
          classList: []
        }
      ]
      withDom(tagNameShadow1, context => {
        assertResultEqual(tagName, getElementsByTagNameNS(namespace, tagName, context), expected, true)
      })
    });

    it('light DOM - wildcard ns', () => {
      const tagName = 'span';
      const namespace = '*';
      const expected = [
        {
          tagName: 'SPAN',
          classList: []
        }
      ]
      withDom(tagNameLight1, context => {
        assertResultEqual(tagName, context.getElementsByTagNameNS(namespace, tagName), expected, true)
      })
    });

    it('shadow DOM - wildcard ns', () => {
      const tagName = 'span';
      const namespace = '*';
      const expected = [
        {
          tagName: 'SPAN',
          classList: []
        }
      ]
      withDom(tagNameShadow1, context => {
        assertResultEqual(tagName, getElementsByTagNameNS(namespace, tagName, context), expected, true)
      })
    });

    it('light DOM - wildcard tagName', () => {
      const tagName = "*";
      const expected = [
        {
          tagName: 'HTML',
          classList: []
        },
        {
          tagName: 'HEAD',
          classList: []
        },
        {
          tagName: 'BODY',
          classList: []
        },
        {
          tagName: 'DIV',
          classList: ['container']
        },
        {
          tagName: 'DIV',
          classList: ['outer-component']
        },
        {
          tagName: 'DIV',
          classList: ['wrapper']
        },
        {
          tagName: 'DIV',
          classList: ['inner-component']
        },
        {
          tagName: 'SPAN',
          classList: []
        }
      ]
      withDom(tagNameLight1, context => {
        assertResultEqual(tagName, context.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', tagName), expected, true)
      })
    });

    it('shadow DOM - wildcard tagName', () => {
      const tagName = "*";
      const expected = [
        {
          tagName: 'HEAD',
          classList: []
        },
        {
          tagName: 'BODY',
          classList: []
        },
        {
          tagName: 'DIV',
          classList: ['container']
        },
        {
          tagName: 'OUTER-COMPONENT',
          classList: []
        },
        {
          tagName: 'DIV',
          classList: ['wrapper']
        },
        {
          tagName: 'INNER-COMPONENT',
          classList: []
        },
        {
          tagName: 'SPAN',
          classList: []
        },
        {
          tagName: 'SCRIPT',
          classList: []
        }
      ]
      withDom(tagNameShadow1, context => {
        assertResultEqual(tagName, getElementsByTagNameNS('http://www.w3.org/1999/xhtml', tagName, context), expected, true)
      })
    });
  })