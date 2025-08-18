import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://localhost:4000';

export default function App() {
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [userId] = useState('demo-user');
  const [habits, setHabits] = useState({ hydrationLiters: 0, proteinGrams: 0, collagenTaken: false, coreDone: false });

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
      form.append('userId', userId);
      form.append('front', { uri: front.uri, name: 'front.jpg', type: 'image/jpeg' });
      form.append('back', { uri: back.uri, name: 'back.jpg', type: 'image/jpeg' });
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: form,
      });
      const json = await response.json();
      setResult(json.analysis || json);
      await fetchHistory();
    } catch (e) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const resp = await fetch(`${API_URL}/reports/${userId}?limit=5`);
      const json = await resp.json();
      setHistory(json || []);
    } catch {}
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

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

        {history?.length > 0 && (
          <View style={styles.result}>
            <Text style={styles.resultTitle}>Recent Reports</Text>
            {history.map((r, idx) => (
              <Text key={idx} style={{ color: '#b0b8c6' }}>{new Date(r.createdAtIso).toLocaleString()} — SRS {r.srs}</Text>
            ))}
          </View>
        )}

        <View style={styles.result}>
          <Text style={styles.resultTitle}>Daily Habits</Text>
          <Text style={{ color: '#b0b8c6' }}>Hydration (L): {habits.hydrationLiters}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button title="+0.5L" onPress={() => setHabits(h => ({ ...h, hydrationLiters: +(h.hydrationLiters + 0.5).toFixed(1) }))} />
            <Button title="Reset" onPress={() => setHabits(h => ({ ...h, hydrationLiters: 0 }))} />
          </View>
          <Text style={{ color: '#b0b8c6', marginTop: 8 }}>Protein (g): {habits.proteinGrams}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button title="+20g" onPress={() => setHabits(h => ({ ...h, proteinGrams: h.proteinGrams + 20 }))} />
            <Button title="Reset" onPress={() => setHabits(h => ({ ...h, proteinGrams: 0 }))} />
          </View>
          <View style={{ height: 8 }} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button title={habits.collagenTaken ? 'Collagen ✓' : 'Collagen'} onPress={() => setHabits(h => ({ ...h, collagenTaken: !h.collagenTaken }))} />
            <Button title={habits.coreDone ? 'Core ✓' : 'Core'} onPress={() => setHabits(h => ({ ...h, coreDone: !h.coreDone }))} />
          </View>
          <View style={{ height: 8 }} />
          <Button title="Save Habits" onPress={async () => {
            const today = new Date();
            const dateIso = today.toISOString().slice(0,10);
            await fetch(`${API_URL}/habits/${userId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dateIso, ...habits })
            });
          }} />
        </View>
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

