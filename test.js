$root = $('body')

class CustomStyle
  constructor: (@selector, @styleDefinition) ->
    #--root--#
    @rootStyle = $('<style>')
    $('head').append(@rootStyle)
    #--attr--#
    @class = if @selector[0] is '.' then @selector.slice(1) else @selector
    @styleRule = "#{@selector} {#{@generateStyle()}}"
    @addStyleToHead()

  generateStyle: () ->
    @combinedStyles = ''
    switch typeof @styleDefinition
      when 'string'
        @combinedStyles += @styleDefinition
        @css = new Proxy(@parseStringToObject(@styleDefinition), { set: (target, property, value, receiver) => @poopertySetHendler(target, property, value, receiver)})
       
      when 'object'
        @css = new Proxy(@styleDefinition, {set: (target, property, value, receiver) => @poopertySetHendler(target, property, value, receiver)})
        for key, value of @styleDefinition
          @combinedStyles += "#{key}: #{value}; "
    #alert(JSON.stringify(@))
    return @combinedStyles
    
  addStyleToHead: () ->
    @rootStyle.text(@styleRule)
  
  parseStringToObject: (str) ->
    obj = {}
    pairs = str.split(';')
    for pair in pairs
        [key, value] = pair.split(':')
        obj[key] = value
    return obj 
  
  poopertySetHendler: (obj, prop, value, receiver) =>
    Reflect.set(obj, prop, value, receiver)
    @updateStyleInHead()
    
  updateStyleInHead: () =>
    @combinedStyles = ''
    for own key, value of @css
      @combinedStyles += "#{key}: #{@css[key]}; "
    @styleRule = "#{@selector} {#{@combinedStyles}}"
    #alert(@styleRule)
    @addStyleToHead()
  copy: (selector) ->
    return new CustomStyle(selector, @styleDefinition)

    
# Пример использования класса CustomStyle
css1 = new CustomStyle('.customClass1', 'background: blue;')
#css2 = new CustomStyle('.test', 'color':'gold')
#css2.css.color = 'red'
css1.css.color = '#06D6A0'
css1.css.background = '#000814'
css1.css['font-size'] = '50px'
$root.addClass(css1.class)
#$root.addClass(css2.class)
#alet()
test = new CustomStyle('.test', 
                       'width':'100px'
                       'height': '100px'
                       'background': '#073B4C'
                      )
test2 = test.copy('.test2')
test2.css.width = '20px'
#alert(JSON.stringify(test2))
$testBlock = $('<div>').addClass(test.class)
$testBlock2 = $('<div>').addClass(test2.class)
$root.append($testBlock)
$root.append($testBlock2)
