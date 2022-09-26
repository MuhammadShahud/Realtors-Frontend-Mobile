/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image, Linking
  // Modal,
} from 'react-native';
import { COLORS, FLEXBOX, Images, SIZES } from '../../Constants';
import styles from './styles';
import Modal from 'react-native-modal';
import { FONTS } from './../../Constants/Themes';
import { RNWebview } from '../../Components';

interface WelcomeProps {
  navigation: any;
}

export default class index extends Component<WelcomeProps> {
  state = {
    modalVisible: false,
    webViewModal : false
  };

  handlePress = (visible: boolean) => {
    this.setState({
      modalVisible: visible,
    });
  };

  toogleWebViewModal = ()=> this.setState({ webViewModal : !this.state.webViewModal})

  render() {
    let { navigate } = this.props.navigation;
    let { modalVisible } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Image source={Images.hero} resizeMode="contain" />
          <View style={styles.pageMaterial}>
            <View>
              <Image
                source={Images.home_logo}
                resizeMode="contain"
                style={styles.logo}
              />
            </View>
            <View style={{ paddingBottom: SIZES.padding * 4 }}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: COLORS.primary }]}
                onPress={() => this.handlePress(true)}>
                <Text style={styles.text}>I am a Realtor</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.toogleWebViewModal()}
                style={[styles.btn, { backgroundColor: COLORS.secondary }]}>
                <Text style={styles.text}>I am a Home/Buyer Seller</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* modal */}
        <Modal
          onBackdropPress={() => this.handlePress(false)}
          backdropOpacity={0.8}
          deviceWidth={SIZES.width}
          deviceHeight={SIZES.height}
          backdropColor="#fff"
          isVisible={modalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <View style={styles.modalContainer}>
              <Text
                style={{
                  textAlign: FLEXBOX.center,
                  color: COLORS.white,
                  ...FONTS.h4,
                }}>
                Are you a licensed realtor?
              </Text>
              <View style={styles.modal}>
                <TouchableOpacity style={styles.modalBtn}>
                  <Text
                    style={{
                      textAlign: FLEXBOX.center,
                      color: COLORS.secondary,
                      ...FONTS.body5,
                    }}
                    onPress={() => {
                      this.handlePress(false);
                      navigate('Login');
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalBtn}>
                  <Text
                    style={{
                      textAlign: FLEXBOX.center,
                      color: COLORS.secondary,
                      ...FONTS.body5,
                    }}
                    onPress={() => this.handlePress(false)}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <RNWebview webViewModal={this.state.webViewModal} toogleWebViewModal={this.toogleWebViewModal}/>
      </SafeAreaView>
    );
  }
}
