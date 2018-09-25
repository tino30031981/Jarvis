self.addEventListener('message', function (e) {
    console.log(self.ol);
    console.log(ol);
    console.log(e.data.layer);
    console.log(e.data.format);
    console.log(e.data.data);
    var layer = e.data.layer;
    var format = e.data.format;
    var data = e.data.data;
    layer.getSource().addFeatures(format.readFeatures(data));
    self.postMessage('terminado');
    self.close();
}, false);