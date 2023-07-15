import {View, Image, StyleSheet, Text} from 'react-native';

export const EventHeader = ({image, eventName, hostedByName}) => {
  return (
    <View style={{marginTop: 100}}>
      <View style={styles.overlap}>
        <View style={styles.accordion}></View>
        <Text style={styles.designThinkingFor}>{eventName}</Text>
        <View style={styles.poweredBy}>
          <View style={styles.overlapGroup}>
            <Text style={styles.hostedBy}>Hosted by</Text>
            <Text style={styles.professorStephen}>{hostedByName}</Text>
          </View>
          <Image
            source={{
              uri: `data:image/png;base64,${image}`,
            }}
            style={styles.appIconInstance}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlap: {
    borderRadius: 10,
    height: 104,
    position: 'relative',
  },
  accordion: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 104,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 333,
  },
  poweredBy: {
    height: 31,
    left: 23,
    position: 'absolute',
    top: 53,
    width: 209,
  },
  overlapGroup: {
    height: 31,
    left: 36,
    position: 'absolute',
    top: 0,
    width: 169,
  },
  hostedBy: {
    color: '#3c3c4399',
    fontSize: 12,
    fontWeight: '500',
    left: 0,
    letterSpacing: 0,
    lineHeight: 16,
    position: 'absolute',
    top: 0,
  },
  designThinkingFor: {
    color: '#737373',
    left: 23,
    position: 'absolute',
    top: 22,
  },
  professorStephen: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600',
    left: 0,
    letterSpacing: -0.08,
    lineHeight: 18,
    position: 'absolute',
    top: 13,
  },
  appIconInstance: {
    height: 28,
    top: 2,
    width: 28,
  },
});
