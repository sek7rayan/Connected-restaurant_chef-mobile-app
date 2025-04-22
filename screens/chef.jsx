import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import updateCommandeState from '../api_commande';

const ChefScreen = ({ notifications, loading, error }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Séparer et trier les commandes
  const pendingOrders = notifications.filter(order => 
    order.status === 'en_attente' || order.status === 'en_cours_de_préparation'
  );
  const finishedOrders = notifications.filter(order => 
    order.status === 'prête'
  );
  
  const sortedPendingOrders = [...pendingOrders].sort((a, b) => {
    // Priorité aux commandes en cours de préparation
    if (a.status === 'en_cours_de_préparation' && b.status !== 'en_cours_de_préparation') return -1;
    if (a.status !== 'en_cours_de_préparation' && b.status === 'en_cours_de_préparation') return 1;
    // Tri par date pour les commandes de même statut
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const sortedFinishedOrders = [...finishedOrders].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const markOrderDone = async () => {
    if (selectedOrder) {
      try {
        await updateCommandeState(selectedOrder.id_commande, 'prête');
        setModalVisible(false);
      } catch (err) {
        console.error("Erreur lors de la mise à jour:", err);
      }
    }
  };

  const markOrderPreparing = async () => {
    if (selectedOrder) {
      try {
        await updateCommandeState(selectedOrder.id_commande, 'en_cours_de_préparation');
        setModalVisible(false);
      } catch (err) {
        console.error("Erreur lors de la mise à jour:", err);
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#a91c1c" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(false)}
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../assets/chef.png')} style={styles.iconLarge} />
          <Text style={styles.title}>Chef Dashboard</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.activeOrders}>Active orders: {pendingOrders.length}</Text>
          <TouchableOpacity>
            <Image source={require('../assets/personne.png')} style={styles.iconSmall} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/notification.png')} style={styles.iconSmall} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pending orders */}
      <View style={styles.sectionHeader}>
        <Image source={require('../assets/pending.png')} style={styles.iconSmall} />
        <Text style={styles.sectionTitle}>Pending orders</Text>
      </View>
      <View style={styles.cardsContainer}>
        {sortedPendingOrders.map((order, idx) => (
          <OrderCard
            key={idx}
            order={order}
            onViewDetails={() => {
              setSelectedOrder(order);
              setModalVisible(true);
            }}
          />
        ))}
      </View>

      {/* Finished orders */}
      <View style={styles.sectionHeader}>
        <Image source={require('../assets/valide.png')} style={styles.iconSmall} />
        <Text style={styles.sectionTitle}>Finished orders</Text>
      </View>
      <View style={styles.cardsContainer}>
        {sortedFinishedOrders.map((order, idx) => (
          <OrderCard key={idx} order={order} />
        ))}
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details - Table #{selectedOrder?.id_table}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalDetails}>
              <Text style={styles.grayText}>Order #{selectedOrder?.id_commande}</Text>
              <Text style={styles.grayText}>Client client-{selectedOrder?.id_commande}</Text>
              <Text style={[styles.grayText, { marginTop: 10, alignSelf: 'flex-end' }]}>
                Ordered at {selectedOrder?.createdAt?.toLocaleTimeString()}
              </Text>
              <Text style={[styles.grayText, { alignSelf: 'flex-end' }]}>
                Status: <Text style={{ 
                  color: selectedOrder?.status === 'en_cours_de_préparation' ? 'orange' : 
                        selectedOrder?.status === 'prête' ? 'green' : 'red'
                }}>
                  {selectedOrder?.status === 'en_attente' ? 'Waiting' : 
                   selectedOrder?.status === 'en_cours_de_préparation' ? 'Preparing' : 
                   'Ready'}
                </Text>
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCol}>Orders</Text>
              <Text style={styles.headerCol}>Quantity</Text>
            </View>
            {selectedOrder?.plats?.map((plat, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.rowCol}>{plat.nom_plat}</Text>
                <Text style={styles.rowCol}>{plat.quantite}</Text>
              </View>
            ))}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.doneBtn} onPress={markOrderDone}>
                <Text style={styles.btnText}>Mark Ready</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.preparingBtn} onPress={markOrderPreparing}>
                <Text style={styles.btnText}>Mark Preparing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

function OrderCard({ order, onViewDetails }) {
  const getStatusColor = () => {
    switch(order.status) {
      case 'en_attente': return '#a91c1c'; // Rouge
      case 'en_cours_de_préparation': return '#f4a742'; // Orange
      case 'prête': return '#1c7c1c'; // Vert
      default: return '#a91c1c';
    }
  };

  const bgColor = getStatusColor();
  const isPending = order.status !== 'prête';

  return (
    <View style={[styles.card, { borderTopColor: bgColor }]}>
      <View style={[styles.cardHeader, { backgroundColor: bgColor }]}>
        <Text style={styles.tableText}>Table #{order.id_table}</Text>
        <View style={styles.orderIdBadge}>
          <Text style={styles.orderIdText}>Order #{order.id_commande}</Text>
        </View>
        <Text style={styles.timeText}>{order.time || 'N/A'}</Text>
      </View>
      <View style={styles.cardBody}>
        <Image source={require('../assets/client.png')} style={styles.iconSmall} />
        <Text> Client order</Text>
        <Text style={{ color: '#999', fontSize: 12 }}>
          {order.plats?.length || 0} items
        </Text>
        {isPending && (
          <TouchableOpacity style={styles.detailsButton} onPress={onViewDetails}>
            <Image source={require('../assets/details.png')} style={styles.detailsIcon} />
            <Text style={styles.detailsText}>View details</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Les styles restent exactement les mêmes que dans votre fichier original
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9ebef',
    padding: 10,
  },
  header: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconLarge: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  iconSmall: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  activeOrders: {
    marginLeft: 7,
    marginRight: 10,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '48%',
    borderTopWidth: 8,
    paddingBottom: 10,
  },
  cardHeader: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tableText: {
    color: 'white',
    fontWeight: 'bold',
  },
  orderIdBadge: {
    backgroundColor: '#f9da6d',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  orderIdText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  timeText: {
    color: 'white',
    marginLeft: 'auto',
    fontSize: 10,
  },
  cardBody: {
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  detailsButton: {
    flexDirection: 'row',
    backgroundColor: '#f4a742',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  detailsIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  detailsText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalClose: {
    fontSize: 20,
  },
  modalDetails: {
    marginBottom: 12,
  },
  grayText: {
    color: '#555',
  },
  tableHeader: {
    backgroundColor: '#a91c1c',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCol: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  rowCol: {
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 10,
  },
  doneBtn: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  preparingBtn: {
    backgroundColor: '#f4a742',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChefScreen;
