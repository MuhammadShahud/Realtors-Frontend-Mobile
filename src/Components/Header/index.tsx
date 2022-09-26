/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Img_url } from '../../Config/APIs';
import { dummyImage } from '../../Config/config';
import styles from './style';
import { Images } from '../../Constants';


interface HeaderProps {
  user?: any;
  title: string;
}

export class index extends Component<HeaderProps> {
  render() {

    const { title } = this.props;
    let image = this.props?.user?.user?.image;
    console.log("this.props?.user?", Img_url + image)
    return (
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Image
            source={{
              uri: image
                ? Img_url + image
                : dummyImage,
            }}
            resizeMode="cover"
            style={styles.img}
          />
        </View>

        <View style={styles.titleView}>
          <Text numberOfLines={1} style={styles.title}>{title}</Text>
        </View>

        <View style={styles.imgContainer}>
          <Image
            source={Images.home_logo}
            resizeMode="cover"
            style={styles.img}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: any) => ({
  user: state.AuthReducer.user,
});

export default connect(mapStateToProps, null)(index);
