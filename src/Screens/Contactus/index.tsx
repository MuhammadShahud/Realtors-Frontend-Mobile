/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Header } from '../../Components';
import { COLORS, FONTS } from '../../Constants';
import styles from './style';
import { NativeBaseProvider, Radio } from 'native-base';
import ContactUsMiddleware from '../../Redux/Middlewares/ContactUsMiddleware';
import { connect } from 'react-redux';
import { ContactUsFormProps } from '../../interface';
interface ContactUsProps {
  navigation: any;
  submitContactUsForm: (obj: ContactUsFormProps) => void;
}

class index extends Component<ContactUsProps> {
  state = {
    title: '',
    description: '',
    value: '',
    loader: false,
  };
  onSubmit = () => {
    const { value: type, title, description } = this.state;

    const successCallBack = () => {
      this.setState({ title: '', description: '', value: '', loader: false });
    };
    const errorCallBack = () => {
      this.setState({ loader: false });
    };

    if (type && title && description) {
      this.setState({ loader: true });
      this.props.submitContactUsForm({
        type,
        title,
        description,
        successCallBack,
        errorCallBack,
      });
    } else {
      Alert.alert('Alert', 'All fields are required');
    }
  };

  onChangeText = (type: any, value: any) => {
    this.setState({
      [type]: value,
    });
  };
  onSelect = (value: any) => {
    this.setState({
      value: value,
    });
  };
  render() {
    let { title, description, value, loader } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{
          flex: 1,
          backgroundColor: COLORS.white,

        }}>
          <View>
            <Header title="Contact Us" />
            <View style={styles.contactContainer}>
              <NativeBaseProvider>
                <Radio.Group
                  name="myRadioGroup"
                  value={value}
                  onChange={val => this.onSelect(val)}
                  style={styles.radioContainer}>
                  <View>
                    <Radio
                      colorScheme={COLORS.primary}
                      // style={styles.radioBtn}
                      value="queries"
                      my={1}
                      size="md">
                      Queries
                    </Radio>
                    <Radio
                      colorScheme={COLORS.primary}
                      // style={styles.radioBtn}
                      value="complaint"
                      my={1}
                      size="md">
                      Complaint
                    </Radio>
                  </View>
                  <View>
                    <Radio
                      colorScheme={COLORS.primary}
                      // style={styles.radioBtn}
                      value="claims"
                      my={1}
                      size="md">
                      Claims
                    </Radio>
                    <Radio
                      colorScheme={COLORS.primary}
                      // style={styles.radioBtn}
                      value="suggestions"
                      my={1}
                      size="md">
                      Suggestions
                    </Radio>

                  </View>
                </Radio.Group>
              </NativeBaseProvider>
              <TouchableOpacity>
                <TextInput
                  style={styles.inputStyles}
                  placeholder="Title"
                  placeholderTextColor={COLORS.darkGrey}
                  autoCapitalize="none"
                  onChangeText={val => this.onChangeText('title', val)}
                  value={title}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <TextInput
                  style={[styles.inputStyles, { textAlignVertical: 'top' }]}
                  multiline={true}
                  numberOfLines={6}
                  placeholder="Description"
                  placeholderTextColor={COLORS.darkGrey}
                  autoCapitalize="none"
                  onChangeText={val => this.onChangeText('description', val)}
                  value={description}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={loader}
                style={styles.btn}
                onPress={this.onSubmit}>
                {this.state.loader ? (
                  <ActivityIndicator size={'small'} color={COLORS.white} />
                ) : (
                  <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = (dispatch: (arg0: any) => any) => {
  return {
    submitContactUsForm: (payload: any) =>
      dispatch(ContactUsMiddleware.submitContactUsForm(payload)),
  };
};
export default connect(null, mapDispatchToProps)(index);
