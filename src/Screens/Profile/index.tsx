/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Header } from '../../Components';
import styles from './style';
import { COLORS, FONTS } from './../../Constants/Themes';
import { connect } from 'react-redux';
import { Img_url } from './../../Config/APIs';
import { Images } from '../../Constants';
import { dummyImage } from '../../Config/config';
import { SIZES } from '../../Constants';
import ChatMiddleware from '../../Redux/Middlewares/ChatMiddleware';

interface ProfileProps {
  navigation: any;
  user: any;
  chatlistCheck: (payload: any) => void;
}

class index extends Component<ProfileProps> {
  constructor(props: ProfileProps) {
    super(props);
    this.state = { designationIds: [], languagesIds: [], specialityIds: [] };
  }

  componentDidMount() {
    let {
      item: { languages, designations, speciality },
    } = this.props.route.params;

    let designationIds = designations?.map(val => val.designation_ids) || [];
    let languagesIds = languages?.map(val => val.language_ids) || [];
    let specialityIds = speciality?.map(val => val.speciality_ids) || [];

    this.setState({ designationIds, languagesIds, specialityIds });
  }

  onPressChat = (item) => {


    const callBack = (data) => {
      console.log("51 -------->",data)
      let obj = { item: { ...item, to_user: { ...item } } };
      obj.item.id = data.id
      this.props.navigation.navigate('InboxDetail', obj)
    }
    this.props.chatlistCheck({ to_user_id: item.id, callBack: callBack })
  }

  render() {
    let { designationIds, languagesIds, specialityIds } = this.state;
    const { languages, designation, speciality } = this.props;
    let { item } = this.props.route.params;
console.log("item 62--------->", item)
    let realtorLanguages = languages.filter(val => {
      let isFound = languagesIds.indexOf(val.id);
      if (isFound !== -1) {
        return true;
      } else {
        return false;
      }
    });
    let realtorDesignation = designation.filter(val => {
      let isFound = designationIds.indexOf(val.id);

      if (isFound !== -1) {
        return true;
      } else {
        return false;
      }
    });

    let realtorSpeciality = speciality.filter(val => {
      let isFound = specialityIds.indexOf(val.id);
      if (isFound !== -1) {
        return true;
      } else {
        return false;
      }
    });

    console.warn('realtorLanguages', item.image);

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Header title="Profile" />

          <View style={styles.bodyContainer}>
            <View
              style={{
                // borderRadius: 20,
                borderRadius: SIZES.radius * 3,
                overflow: 'hidden',
                backgroundColor: COLORS.primary,
              }}>
              <Image
                source={{ uri: item?.image ? Img_url + item?.image : dummyImage }}
                resizeMode={item?.image ? 'cover' : 'contain'}
                style={{
                  height: 250,
                  backgroundColor: COLORS.white,
                }}
              />
              <View style={[styles.username, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text
                  style={{
                    ...FONTS.h4,
                    color: COLORS.white,
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                    textAlign: 'center',
                    flex: 1
                  }} numberOfLines={1}>
                  {`${item.f_name} ${item.l_name}`}
                </Text>

                {this.props.user.user.id !== item.id ? <Text onPress={() => this.onPressChat(item)} style={{ backgroundColor: COLORS.white, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 7 }}>Chat</Text> : null}
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View
                  style={[
                    styles.contactContainer,
                    { borderRightWidth: 1, borderRightColor: COLORS.white },
                  ]}>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontWeight: 'bold',
                      fontSize: SIZES.h4,
                    }}>
                    {item?.license_num ? item?.license_num : ''}
                  </Text>
                  <Text style={{ color: COLORS.white, fontSize: SIZES.body5 }}>
                    License #
                  </Text>
                </View>
                <View style={styles.contactContainer}>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontWeight: 'bold',
                      fontSize: SIZES.h4,
                    }}>
                    {item?.phone ? item?.phone : ''}
                  </Text>
                  <Text style={{ color: COLORS.white, fontSize: SIZES.body5 }}>
                    Contact #
                  </Text>
                </View>
              </View>
            </View>

            <Text style={[styles.titles, { fontSize: SIZES.body3 }]}>
              About me:
            </Text>

            {item?.about != null && item?.about != 'null' ? (
              <View
                style={{
                  alignSelf: 'center',
                  paddingHorizontal: SIZES.padding,
                  // paddingTop: SIZES.padding * 2,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    ...FONTS.body5,
                    lineHeight: SIZES.padding + SIZES.base,
                    paddingBottom: SIZES.padding,
                  }}>
                  {item?.about.replace(/\s{2,}/g, ' ').trim()}
                </Text>
              </View>
            ) : null}

            <View style={styles.socialIconContainer}>
              {item?.insta_link != null && item?.insta_link != 'null' ? (
                <TouchableOpacity
                  style={{ marginVertical: SIZES.padding - 7 }}
                  onPress={() => Linking.openURL('https://' + item?.insta_link)}>
                  <Entypo name="instagram" size={24} color="#a42626" />
                </TouchableOpacity>
              ) : null}

              {item?.linkedin_link != null && item?.linkedin_link != 'null' ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://' + item?.linkedin_link)}
                  style={{
                    paddingHorizontal: SIZES.padding - 4,
                    marginVertical: SIZES.padding - 7,
                  }}>
                  <AntDesign name="linkedin-square" size={25} color="#0077b5" />
                </TouchableOpacity>
              ) : null}

              {item?.fb_link != 'null' && item?.fb_link != null ? (
                <TouchableOpacity
                  style={{ marginVertical: SIZES.padding - 7 }}
                  onPress={() => Linking.openURL('https://' + item?.fb_link)}>
                  <Entypo name="facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.titles}>Email:</Text>
              <Text style={[styles.details, { textTransform: 'none' }]}>
                {item?.email}
              </Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.titles}>Language:</Text>
              {realtorLanguages?.map(val => (
                <Text style={styles.details}>{val?.name}</Text>
              ))}
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.titles}>Designation:</Text>
              {realtorDesignation?.map(val => (
                <Text style={styles.details}>{val?.name}</Text>
              ))}
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.titles}>Speciality:</Text>
              {realtorSpeciality?.map(val => (
                <Text style={styles.details}>{val?.name}</Text>
              ))}
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.titles}>Country:</Text>
              <Text style={styles.details}>
                {item?.country?.name ? item?.country?.name : ''}
              </Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.titles}>State/Province:</Text>
              <Text style={styles.details}>
                {item?.state.name ? item?.state.name : ''}
              </Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.titles}>City:</Text>
              <Text style={styles.details}>
                {item?.city?.name ? item?.city?.name : ''}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const mapStateToProps = (state: { AuthReducer: { user: any } }) => {
  return {
    user: state.AuthReducer.user,
    languages: state.AuthReducer.languages,
    speciality: state.AuthReducer.speciality,
    designation: state.AuthReducer.designation,
  };
};

const mapDispatchToProps = (dispatch: (arg0: any) => any) => {
  return {
    chatlistCheck: (payload: any) =>
      dispatch(ChatMiddleware.chatlistCheck(payload))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
