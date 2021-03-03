import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);

  const [instance, setInstance] = useState(undefined);
  const [doc, setDoc] = useState('/files/PDFTRON_about.pdf');

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: doc,
      },
      viewer.current,
    ).then((instance) => {

      setInstance(instance);

      const { docViewer, Annotations } = instance;
      const annotManager = docViewer.getAnnotationManager();

      docViewer.on('documentLoaded', () => {
        const rectangleAnnot = new Annotations.RectangleAnnotation();
        rectangleAnnot.PageNumber = 1;
        // values are in page coordinates with (0, 0) in the top left
        rectangleAnnot.X = 100;
        rectangleAnnot.Y = 150;
        rectangleAnnot.Width = 200;
        rectangleAnnot.Height = 50;
        rectangleAnnot.Author = annotManager.getCurrentUser();

        annotManager.addAnnotation(rectangleAnnot);
        // need to draw the annotation otherwise it won't show up until the page is refreshed
        annotManager.redrawAnnotation(rectangleAnnot);
      });

      docViewer.on('layoutChanged', e => {
        console.log('LAYOUT CHANGE', e);
      });
    });
  }, []);

  useEffect(() => {
    if (!instance) {
      return;
    }

    instance.loadDocument(doc);
  }, [doc]);

  const toggle = async () => {
    if (!instance) {
      return;
    }

    await instance.closeDocument();

    setDoc(doc === '/files/PDFTRON_about.pdf' ? '/files/Document1.pdf' : '/files/PDFTRON_about.pdf');
  }

  return (
    <div className="App">
      <div className="header">
        <span>React sample</span>
        <button onClick={toggle}>Toggle document</button>
      </div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
