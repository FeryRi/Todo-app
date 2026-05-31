import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const PROJECT = {
  name: "Todo",
  description:
    `Aplicación movil de to-do que permite crear temas o tareas con sus subtareas a completar, eliminarlas, completarlas, editarlas y buscar tanto tareas/módulos o subtareas en curso como completadas`,
  tags: ["REACT NATIVE", "MOBILE UI", "EXPO"],
};


const AUTHOR = {
  image: require("@/assets/images/IMG_5683.png"),
  role: "estudiante",
  name: "Fernanda Ríos Juárez",
  interests: [
    { icon: "code" as const,       label: "INTEREST", value: "Redes" },
    { icon: "palette" as const,    label: "HOBBIES",     value: "Bailar, cantar, anime" },
  ],
  quote:
    "\"これあまり好きではないなのでもう辞めたい\"",
};



export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* ── About the Project ── */}
        <View style={styles.sectionCard}>
          <View style={styles.accentBar} />
          <View style={styles.sectionBody}>
            <Text style={styles.sectionTitle}>About the Project</Text>

            <Text style={styles.paragraph}>
              <Text style={styles.projectName}>{PROJECT.name} </Text>
            </Text>

            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              {PROJECT.description}
            </Text>

            <View style={styles.tagsRow}>
              {PROJECT.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── About Me ── */}
        <View style={styles.sectionCard}>
          <View style={styles.accentBar} />
          <View style={styles.sectionBody}>
            <Text style={styles.sectionTitle}>About Me</Text>

            {/* Tarjeta de perfil */}
            <View style={styles.profileCard}>
              <Image source={AUTHOR.image} style={styles.avatar} />
              <View style={styles.profileInfo}>
                <Text style={styles.roleLabel}>{AUTHOR.role}</Text>
                <Text style={styles.authorName}>{AUTHOR.name}</Text>
              </View>
            </View>

            {/* Tarjetas de intereses */}
            <View style={styles.interestsRow}>
              {AUTHOR.interests.map((item) => (
                <View key={item.label} style={styles.interestCard}>
                  <MaterialIcons name={item.icon} size={20} color="#3B82F6" />
                  <Text style={styles.interestLabel}>{item.label}</Text>
                  <Text style={styles.interestValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            {/* Cita */}
            <Text style={styles.quote}>{AUTHOR.quote}</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 20,
    paddingBottom: 60,
    gap: 20,
  },

  // Tarjeta de sección con barra de acento izquierda
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  accentBar: {
    width: 4,
    backgroundColor: "#3B82F6",
  },
  sectionBody: {
    flex: 1,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  // Texto del proyecto
  paragraph: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 21,
  },
  projectName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3B82F6",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  tag: {
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#3B82F6",
    letterSpacing: 0.5,
  },

  // Perfil
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
  },
  profileInfo: {
    gap: 2,
  },
  roleLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#3B82F6",
    letterSpacing: 1,
  },
  authorName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  // Tarjetas de intereses
  interestsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  interestCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  interestLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.8,
    marginTop: 2,
  },
  interestValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  // Cita
  quote: {
    fontSize: 13,
    color: "#6B7280",
    fontStyle: "italic",
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 8,
  },
});
