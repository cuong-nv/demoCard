var canvas;
var extendedTextbox = fabric.util.createClass(fabric.Textbox, {

    _wrapLine: function(text, lineIndex) {
  
      var lineWidth        = 0,
          lines            = [],
          line             = '',
          words            = text.split(this._reSpaceAndTab),
          word             = '',
          letter           = '',
          offset           = 0,
          infix            = ' ',
          wordWidth        = 0,
          infixWidth       = 0,
          letterWidth      = 0,
          largestWordWidth = 0;
      
      for (var i = 0; i < words.length; i++) {
          word = words[i];
          wordWidth = this._measureWord(word, lineIndex, offset);
          lineWidth += infixWidth;
      
          // Break Words if wordWidth is greater than textbox width
          if (this.breakWords && wordWidth > this.width) {
              line += infix;
              var wordLetters = word.split('');
              while (wordLetters.length) {
                  letterWidth = this._measureWord(wordLetters[0], lineIndex, offset);
                  if (lineWidth + letterWidth > this.width) {
                      lines.push(line);
                      line = '';
                      lineWidth = 0;
                  }
                  line += wordLetters.shift();
                  offset++;
                  lineWidth += letterWidth;
              }
              
              word = '';
          } else {
              lineWidth += wordWidth;
          }
      
          if (lineWidth >= this.width && line !== '') {
              lines.push(line);
              line = '';
              lineWidth = wordWidth;
          }
      
          if (line !== '' || i === 1) {
              line += infix;
          }
          line += word;
          offset += word.length;
          infixWidth = this._measureWord(infix, lineIndex, offset);
          offset++;
      
          // keep track of largest word
          if (wordWidth > largestWordWidth && !this.breakWords) {
              largestWordWidth = wordWidth;
          }
      }
      
      i && lines.push(line);
      
      if (largestWordWidth > this.dynamicMinWidth) {
          this.dynamicMinWidth = largestWordWidth;
      }
      return lines;
      },
  
      _splitTextIntoLines: function(text) {
        var newText = fabric.Text.prototype._splitTextIntoLines.call(this, text), graphemeLines = this._wrapText(newText.lines, this.width), lines = new Array(graphemeLines.length);
        for (var i = 0; i < graphemeLines.length; i++) {
            lines[i] = graphemeLines[i];
        }
        newText.lines = lines;
        newText.graphemeLines = graphemeLines;
        return newText;
    }
  
  });

function updateTextChat(){
    var text = $("#id_chat").val();
    objs = canvas.getObjects();
    objs.forEach(function(obj) {
        
        if (obj && obj.id == 'chat_text_id') {
        obj.text = text;
        canvas.renderAll();
        }
    });
}
function addImage(image){
    var srci = $(image).attr('src');
    console.log(srci);
    fabric.Image.fromURL(srci, function(img1) {
        img1.scale(0.2).set({
        left: 0,
        top: 0,
        angle: 0,
        borderColor: 'black',
        borderScaleFactor: 1
        });
        canvas.add(img1).setActiveObject(img1);
    
    }, null,{ crossOrigin: 'anonymous' });  
}

function changeAvatar(input){
    $(".menu_chose_avatar").show();
    $(".menu_image").hide();
    $(".main_menu").hide();
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var objs = canvas.getObjects();
            objs.forEach(function(obj) {
                
                if (obj){ 
                    if(obj.id == 'id_avatar') {
                        canvas.remove(obj);
                    }else {
                        obj.opacity = 0;
                        obj.selectable = false;
                    }
                    canvas.renderAll();
                }
            });
            canvas.overlayImage.opacity = 0.7;
            fabric.Image.fromURL(e.target.result, function(img1) {
                img1.scale(0.4).set({
                    id: "id_avatar",
                    left: 0,
                    top: 0,
                    angle: 0,
                    borderColor: 'black',
                    borderScaleFactor: 3
                });
                canvas.add(img1).setActiveObject(img1);
                canvas.moveTo(img1,0);
            });
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}


function updateAvatarImageStatus(){
    // var check = $(checkbox).prop("checked");
    
    var objs = canvas.getObjects();
    objs.forEach(function(obj) {
        if (obj && obj.id == 'id_avatar') {
            // obj.selectable = !check;
            // if(check){
            canvas.overlayImage.opacity = 0;
            var objs = canvas.getObjects();
            objs.forEach(function(obj) {
                
                if (obj){ 
                    obj.opacity = 1;
                    var stringid = ""+obj.id;
                    if(stringid == 'undefined') {
                        obj.selectable = true;
                    }else {
                        
                        obj.selectable = false;
                    }
                    canvas.renderAll();
                }
            });
            // }

            canvas.discardActiveObject();
            canvas.requestRenderAll();
            $(".menu_chose_avatar").hide();
            $(".menu_image").show();
            $(".main_menu").show();
        }
    });
}

function convertToImagen() {
    console.log("send");
    //canvas.isDrawingMode = false;    
    downloadFabric(canvas,"newcard");
    
}

function download(url,name){
    // make the link. set the href and download. emulate dom click
    $('<a>').attr({href:url,download:name})[0].click();
                        }
function downloadFabric(canvas,name){
    var dataURL = canvas.toDataURL({
        format: "png",
        left: 0,
        top: 0,
        width: canvas.width ,
        height: canvas.height ,
    });
    //  convert the canvas to a data url and download it.
    download(dataURL,name+'.png');
    
}
function addBoxChat(){
    var rect = new fabric.Rect({
        id:"boxchat",
        top : 120,
        left : 360,
        width : 230,
        height : 250,
        fill : 'transparent',
        stroke : 'black',
        strokeWidth : 1,
        selectable: false
    });
    canvas.add(rect);

    var textbox = new extendedTextbox('',{
        id: "chat_text_id",
        width: 210,
        
        top: 130,
        left: 370,
        fontSize: 30,
        editable: false,
        selectable: false,
        breakWords: true
    });
    canvas.add(textbox);
}

function addBackground(bgImage){
    fabric.Image.fromURL(bgImage, function(img) {
        img.scale(0.6).set({
            id:"background",    
            left: 0,
            top: 0,
            angle: 0,
            selectable: false,
        });
        canvas.add(img);
        canvas.moveTo(img,0);
    }, null,{ crossOrigin: 'anonymous' });
    addBackground2(bgImage);
}

function addBackground2(bgImage){
    canvas.setOverlayImage(bgImage, function(img) {
    canvas.overlayImage.scaleX = 0.6;
    canvas.overlayImage.scaleY = 0.6;
    canvas.overlayImage.opacity = 0;
    canvas.renderAll();
        
    }, null,{ crossOrigin: 'anonymous' });
}



$(document).ready(function() {
    canvas = new fabric.Canvas('canvas');
    addBackground('New_TC_P_004.png');
    // canvas.setOverlayImage('New_TC_P_004.png', functiocanvas.renderAll.bind(canvas));
   addBoxChat();

    $("#chose-card").change(function(){
        var objs = canvas.getObjects();
        objs.forEach(function(obj) {
            canvas.remove(obj);
        });
        addBackground($(this).val());
        addBoxChat();
    });    
  

});


