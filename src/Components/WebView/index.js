import React from 'react';
import {useWindowDimensions, ScrollView} from 'react-native';
import RenderHtml from 'react-native-render-html';

export default ({html}) => {
  const source = {
    html: html,
  };
  const {width} = useWindowDimensions();

  const tagsStyles = {
    'p': {
      color: 'white',
    },
    'h2': {
      color: 'white',
    },
  
  };
  return (
    <ScrollView>
      <RenderHtml
        contentWidth={width}
        source={source}
        tagsStyles={tagsStyles}
      />
    </ScrollView>
  );
};
