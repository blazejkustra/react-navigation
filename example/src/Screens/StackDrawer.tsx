import type {
  EventArg,
  NavigationProp,
  NavigatorScreenParams,
  PathConfig,
  ScreenLayoutArgs,
  StaticScreenProps,
} from '@react-navigation/native';
import {
  createStackNavigator,
  type StackCardInterpolationProps,
  type StackNavigationOptions,
  type StackScreenProps,
} from '@react-navigation/stack';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const DRAWER_WIDTH_RATIO = 0.75;

type NestedStackParamList = {
  NestedHome: undefined;
  NestedDetail: undefined;
};

type StackDrawerParamList = {
  DrawerHome: undefined;
  Article: { author: string } | undefined;
  Albums: undefined;
  NewsFeed: { date: number };
  Nested: NavigatorScreenParams<NestedStackParamList>;
};

const linking = {
  screens: {
    DrawerHome: 'drawer-home',
    Article: 'article',
    NewsFeed: 'news-feed',
    Albums: 'albums',
    Nested: {
      path: 'nested',
      screens: {
        NestedHome: 'home',
        NestedDetail: 'detail',
      },
    },
  },
} satisfies PathConfig<NavigatorScreenParams<StackDrawerParamList>>;

function forDrawerSlide({
  current,
  layouts: { screen },
}: StackCardInterpolationProps) {
  const translateX = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [screen.width, 0],
    extrapolate: 'clamp',
  });

  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
    extrapolate: 'clamp',
  });

  return {
    cardStyle: {
      transform: [{ translateX }],
    },
    overlayStyle: { opacity: overlayOpacity },
  };
}

const DrawerHomeScreen = ({
  navigation,
}: StackScreenProps<StackDrawerParamList, 'DrawerHome'>) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Article', { author: 'Gandalf' })}
        >
          <Text style={styles.buttonText}>Open Article</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Albums')}
        >
          <Text style={styles.buttonText}>Open Albums</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('NewsFeed', { date: Date.now() })}
        >
          <Text style={styles.buttonText}>Open News Feed</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate('Nested', { screen: 'NestedHome' })
          }
        >
          <Text style={styles.buttonText}>Open Nested Stack</Text>
        </Pressable>
      </View>
    </View>
  );
};

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<StackDrawerParamList, 'Article'>) => {
  return (
    <View style={styles.contentScreen}>
      <Pressable style={styles.overlay} onPress={() => navigation.goBack()} />
      <View style={styles.contentPanel}>
        <View style={styles.buttons}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.popTo('DrawerHome')}
          >
            <Text style={styles.buttonText}>Back to drawer</Text>
          </Pressable>
        </View>
        <Text style={styles.screenText}>
          Article by {route.params?.author ?? 'Unknown'}
        </Text>
      </View>
    </View>
  );
};

const AlbumsScreen = ({
  navigation,
}: StackScreenProps<StackDrawerParamList, 'Albums'>) => {
  return (
    <View style={styles.contentScreen}>
      <Pressable style={styles.overlay} onPress={() => navigation.goBack()} />
      <View style={styles.contentPanel}>
        <View style={styles.buttons}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.popTo('DrawerHome')}
          >
            <Text style={styles.buttonText}>Back to drawer</Text>
          </Pressable>
        </View>
        <Text style={styles.screenText}>Albums</Text>
      </View>
    </View>
  );
};

const NewsFeedScreen = ({
  navigation,
  route,
}: StackScreenProps<StackDrawerParamList, 'NewsFeed'>) => {
  return (
    <View style={styles.contentScreen}>
      <Pressable style={styles.overlay} onPress={() => navigation.goBack()} />
      <View style={styles.contentPanel}>
        <View style={styles.buttons}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.popTo('DrawerHome')}
          >
            <Text style={styles.buttonText}>Back to drawer</Text>
          </Pressable>
        </View>
        <Text style={styles.screenText}>
          News Feed - {new Date(route.params.date).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const drawerScreenOptions = {
  headerShown: false,
  presentation: 'transparentModal' as const,
  animation: 'default' as const,
  cardStyleInterpolator: forDrawerSlide,
  cardOverlayEnabled: true,
  gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  transitionSpec: {
    open: { animation: 'timing' as const, config: { duration: 300 } },
    close: { animation: 'timing' as const, config: { duration: 300 } },
  },
};

const StackNavigator = createStackNavigator<StackDrawerParamList>();
const NestedNavigator = createStackNavigator<NestedStackParamList>();

const NestedHomeScreen = ({
  navigation,
}: StackScreenProps<NestedStackParamList, 'NestedHome'>) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('NestedDetail')}
        >
          <Text style={styles.buttonText}>Open Nested Detail</Text>
        </Pressable>
      </View>
    </View>
  );
};

const NestedDetailScreen = ({
  navigation,
}: StackScreenProps<NestedStackParamList, 'NestedDetail'>) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back to Nested Home</Text>
        </Pressable>
      </View>
      <Text style={styles.screenText}>Nested Detail Screen</Text>
    </View>
  );
};

const NestedLayout = ({
  children,
  navigation,
}: ScreenLayoutArgs<
  NestedStackParamList,
  keyof NestedStackParamList,
  StackNavigationOptions,
  NavigationProp<NestedStackParamList>
>) => {
  useEffect(() => {
    const transitionStartListener = navigation.addListener(
      'transitionStart',
      (e: EventArg<'transitionStart', true>) => {
        console.log('[Nested] transitionStart', e.data);
      }
    );
    const transitionEndListener = navigation.addListener(
      'transitionEnd',
      (e: EventArg<'transitionEnd', true>) => {
        console.log('[Nested] transitionEnd', e.data);
      }
    );

    return () => {
      transitionStartListener();
      transitionEndListener();
    };
  }, [navigation]);

  return children;
};

const NestedStack = () => {
  return (
    <NestedNavigator.Navigator
      screenLayout={(props) => <NestedLayout {...props} />}
    >
      <NestedNavigator.Screen
        name="NestedHome"
        component={NestedHomeScreen}
        options={{ title: 'Nested Home' }}
      />
      <NestedNavigator.Screen
        name="NestedDetail"
        component={NestedDetailScreen}
        options={{
          ...drawerScreenOptions,
          title: 'Nested Detail',
        }}
      />
    </NestedNavigator.Navigator>
  );
};

const ContentLayout = ({
  children,
  navigation,
}: ScreenLayoutArgs<
  StackDrawerParamList,
  keyof StackDrawerParamList,
  StackNavigationOptions,
  NavigationProp<StackDrawerParamList>
>) => {
  useEffect(() => {
    const transitionStartListener = navigation.addListener(
      'transitionStart',
      (e: EventArg<'transitionStart', true>) => {
        console.log('transitionStart', e.data);
      }
    );
    const transitionEndListener = navigation.addListener(
      'transitionEnd',
      (e: EventArg<'transitionEnd', true>) => {
        console.log('transitionEnd', e.data);
      }
    );

    return () => {
      transitionStartListener();
      transitionEndListener();
    };
  }, [navigation]);

  return children;
};

export function StackDrawer(
  _: StaticScreenProps<NavigatorScreenParams<StackDrawerParamList>>
) {
  return (
    <StackNavigator.Navigator
      screenLayout={(props) => <ContentLayout {...props} />}
    >
      <StackNavigator.Screen
        name="DrawerHome"
        component={DrawerHomeScreen}
        options={{ title: 'Drawer' }}
      />
      <StackNavigator.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          ...drawerScreenOptions,
          title: `Article by ${route.params?.author ?? 'Unknown'}`,
        })}
      />
      <StackNavigator.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{
          ...drawerScreenOptions,
          title: 'Albums',
        }}
      />
      <StackNavigator.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{
          ...drawerScreenOptions,
          title: 'Feed',
        }}
      />
      <StackNavigator.Screen
        name="Nested"
        component={NestedStack}
        options={{
          ...drawerScreenOptions,
          title: 'Nested Stack',
        }}
      />
    </StackNavigator.Navigator>
  );
}

StackDrawer.title = 'Stack - Drawer';
StackDrawer.linking = linking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    margin: 12,
  },
  button: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  screenText: {
    fontSize: 18,
    margin: 16,
  },
  contentScreen: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    width: `${(1 - DRAWER_WIDTH_RATIO) * 100}%`,
  },
  contentPanel: {
    flex: 1,
    backgroundColor: 'white',
  },
});
