import React from 'react'
import { Modal, View, TouchableOpacity, Text , StyleSheet, SafeAreaView} from 'react-native'
import WebView from 'react-native-webview'

class RNWebview extends React.Component{
   
  
     render () {
     return (
       <Modal
         animationType={'slide'}
         visible={this.props.webViewModal}
        //  onRequestClose={this.hide.bind(this)}
         transparent
       >
         <SafeAreaView style={{ flex:1}}>
           <View style={{ flex:1, backgroundColor :'white'}}>
          
             <WebView
               style={[{ flex: 1 }, this.props.styles]}
               source={{ uri: `https://www.realtorschoiceproducts.com/` }}
               scalesPageToFit
               startInLoadingState
              //  onNavigationStateChange={this._onNavigationStateChange.bind(this)}
              //  onError={this._onNavigationStateChange.bind(this)}
             />
          <TouchableOpacity onPress={this.props.toogleWebViewModal} style={{
             position :'absolute', top :  0, right : 5, 
             alignSelf :'flex-end' , backgroundColor :'gray', marginTop:20, paddingHorizontal : 10, paddingVertical : 5, borderRadius : 4}}>
               <Text style={{ color : 'white', paddingHorizontal :7,fontWeight :'bold'}}>close</Text>
             </TouchableOpacity>
           </View>
         </SafeAreaView>
       </Modal >
     
      )
     }
     
}

const styles = StyleSheet.create({

})

export default RNWebview;