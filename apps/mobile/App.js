import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://localhost:4000';

export default function App() {
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const pickImage = async (setter) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled) {
      setter(res.assets[0]);
    }
  };

  const analyze = async () => {
    if (!front || !back) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('front', { uri: front.uri, name: 'front.jpg', type: 'image/jpeg' });
      form.append('back', { uri: back.uri, name: 'back.jpg', type: 'image/jpeg' });
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: form,
      });
      const json = await response.json();
      setResult(json.analysis || json);
    } catch (e) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>FitBuddy AI</Text>
        <Text style={styles.subtitle}>AI Personal Trainer & Skin Recovery Coach</Text>

        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.label}>Front Photo</Text>
            {front ? <Image source={{ uri: front.uri }} style={styles.image} /> : <View style={styles.placeholder} />}
            <Button title="Pick Front" onPress={() => pickImage(setFront)} />
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Back Photo</Text>
            {back ? <Image source={{ uri: back.uri }} style={styles.image} /> : <View style={styles.placeholder} />}
            <Button title="Pick Back" onPress={() => pickImage(setBack)} />
          </View>
        </View>

        <Button title="Analyze" onPress={analyze} disabled={!front || !back || loading} />
        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

        {result && (
          <View style={styles.result}>
            <Text style={styles.resultTitle}>Skin Recovery Score: {result.skinRecoveryScore ?? '—'}</Text>
            <Text>Front: {result.front?.assessment}</Text>
            <Text>Back: {result.back?.assessment}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1221' },
  container: { padding: 16, gap: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 14, color: '#b0b8c6' },
  row: { flexDirection: 'row', gap: 12 },
  card: { flex: 1, backgroundColor: '#121a2b', padding: 12, borderRadius: 12, gap: 8 },
  label: { color: '#fff' },
  image: { width: '100%', aspectRatio: 3/4, borderRadius: 8 },
  placeholder: { width: '100%', aspectRatio: 3/4, backgroundColor: '#1c2742', borderRadius: 8 },
  result: { backgroundColor: '#121a2b', padding: 16, borderRadius: 12, gap: 6 },
  resultTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

