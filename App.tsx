import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// =====================================
// 1. TypeScript types
// =====================================

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

type StatutEvenement = 'Complet' | 'Presque complet' | 'Ouvert';

// =====================================
// 2. Données
// =====================================

const evenements: Evenement[] = [
  {
    id: 'E01',
    titre: 'Atelier React',
    categorie: 'Atelier',
    capacite: 25,
    inscrits: 25,
  },
  {
    id: 'E02',
    titre: 'Conférence IA',
    categorie: 'Conférence',
    capacite: 70,
    inscrits: 52,
  },
  {
    id: 'E03',
    titre: 'Sécurité mobile',
    categorie: 'Atelier',
    capacite: 20,
    inscrits: 17,
  },
  {
    id: 'E04',
    titre: 'Design UI',
    categorie: 'Atelier',
    capacite: 18,
    inscrits: 9,
  },
  {
    id: 'E05',
    titre: 'Forum projets',
    categorie: 'Rencontre',
    capacite: 50,
    inscrits: 49,
  },
  {
    id: 'E06',
    titre: 'Découverte Git',
    categorie: 'Atelier',
    capacite: 24,
    inscrits: 24,
  },
];

// =====================================
// 3. Fonctions de calcul
// =====================================

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): StatutEvenement {
  const places = placesRestantes(e);

  if (places === 0) {
    return 'Complet';
  } else if (places <= 3) {
    return 'Presque complet';
  } else {
    return 'Ouvert';
  }
}

// =====================================
// 4. Indicateurs globaux
// =====================================

const totalEvenements = evenements.length;

const evenementsComplets = evenements.filter(
  (e) => placesRestantes(e) === 0
).length;

const evenementsAvecPlaces = evenements.filter(
  (e) => placesRestantes(e) > 0
).length;

const sommePlacesRestantes = evenements.reduce(
  (total, e) => total + placesRestantes(e),
  0
);

// Tableau contenant uniquement les ateliers disponibles
const ateliersDisponibles = evenements.filter(
  (e) => e.categorie === 'Atelier' && placesRestantes(e) > 0
);

// =====================================
// 5. Choix du mode
// =====================================

// Modifier cette constante pour changer le mode :
const mode: 'tous' | 'ateliers' = 'tous';

const evenementsAffiches =
  mode === 'tous' ? evenements : ateliersDisponibles;

// =====================================
// 6. Composant BadgeEtat
// =====================================

type BadgeEtatProps = {
  statut: StatutEvenement;
};

function BadgeEtat({ statut }: BadgeEtatProps) {
  let couleurFond = '';
  let couleurTexte = '';

  if (statut === 'Complet') {
    couleurFond = '#FEE2E2';
    couleurTexte = '#B91C1C';
  } else if (statut === 'Presque complet') {
    couleurFond = '#FFEDD5';
    couleurTexte = '#C2410C';
  } else {
    couleurFond = '#DCFCE7';
    couleurTexte = '#15803D';
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: couleurFond,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color: couleurTexte,
          },
        ]}
      >
        {statut}
      </Text>
    </View>
  );
}

// =====================================
// 7. Composant CarteEvenement
// =====================================

type CarteEvenementProps = {
  evenement: Evenement;
};

function CarteEvenement({ evenement }: CarteEvenementProps) {
  const places = placesRestantes(evenement);
  const statut = statutEvenement(evenement);

  return (
    <View style={styles.eventCard}>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>
          {evenement.titre}
        </Text>

        <Text style={styles.eventCategory}>
          {evenement.categorie}
        </Text>

        <Text style={styles.eventPlaces}>
          {places} place{places > 1 ? 's' : ''} restante{places > 1 ? 's' : ''}
        </Text>
      </View>

      <BadgeEtat statut={statut} />
    </View>
  );
}

// =====================================
// 8. Composant BlocStatistique
// =====================================

type BlocStatistiqueProps = {
  libelle: string;
  nombre: number;
};

function BlocStatistique({
  libelle,
  nombre,
}: BlocStatistiqueProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>
        {nombre}
      </Text>

      <Text style={styles.statLabel}>
        {libelle}
      </Text>
    </View>
  );
}

// =====================================
// 9. Statistiques à afficher
// =====================================

const statistiques = [
  {
    id: '1',
    libelle: 'Total événements',
    nombre: totalEvenements,
  },
  {
    id: '2',
    libelle: 'Événements complets',
    nombre: evenementsComplets,
  },
  {
    id: '3',
    libelle: 'Événements avec des places',
    nombre: evenementsAvecPlaces,
  },
  {
    id: '4',
    libelle: 'Places restantes',
    nombre: sommePlacesRestantes,
  },
];

// =====================================
// 10. Application principale
// =====================================

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={evenementsAffiches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarteEvenement evenement={item} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}

        // En-tête, statistiques et titre du mode
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.appTitle}>
                CampusAgenda
              </Text>

              <Text style={styles.subtitle}>
                Découvrez les événements de votre campus.
              </Text>
            </View>

            <View style={styles.statsContainer}>
              {statistiques.map((stat) => (
                <BlocStatistique
                  key={stat.id}
                  libelle={stat.libelle}
                  nombre={stat.nombre}
                />
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {mode === 'tous'
                  ? 'Tous les événements'
                  : 'Ateliers disponibles'}
              </Text>

              <Text style={styles.eventCount}>
                {evenementsAffiches.length} événement(s)
              </Text>
            </View>
          </View>
        }

        // Message si la liste est vide
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Aucun événement disponible
            </Text>

            <Text style={styles.emptyMessage}>
              Il n'y a actuellement aucun événement à afficher.
            </Text>
          </View>
        }

      />
    </SafeAreaView>
  );
}

// =====================================
// 11. Styles
// =====================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },

  listContent: {
    padding: 20,
    paddingBottom: 35,
  },

  header: {
    marginBottom: 25,
    marginTop: 10,
  },

  appTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#172554',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: '#64748B',
  },

  // Statistiques
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  statNumber: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 5,
  },

  statLabel: {
    fontSize: 13,
    color: '#64748B',
  },

  // Titre de la liste
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1E293B',
    flexShrink: 1,
  },

  eventCount: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 8,
  },

  // Carte événement
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  eventInfo: {
    flex: 1,
    minWidth: 0,
    marginRight: 10,
  },

  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 5,
  },

  eventCategory: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },

  eventPlaces: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },

  // Badge
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    maxWidth: 115,
    flexShrink: 1,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Liste vide
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});