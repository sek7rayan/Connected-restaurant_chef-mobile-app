import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Dimensions
} from 'react-native';

const initialOrders = [
  { id: '1', table: '1', status: 'pending', time: '31 minutes ago' },
  { id: '2', table: '2', status: 'pending', time: '31 minutes ago' },
  { id: '3', table: '3', status: 'pending', time: '31 minutes ago' },
  { id: '1234', table: '12', status: 'pending', time: '31 minutes ago' },
  { id: '1234', table: '12', status: 'pending', time: '31 minutes ago' },
  { id: '1234', table: '12', status: 'pending', time: '31 minutes ago' },
  { id: '1234', table: '12', status: 'pending', time: '31 minutes ago' },
];

const initialFinishedOrders = [
  { id: '1234', table: '12', status: 'finished', time: '31 minutes ago' },
  { id: '1234', table: '12', status: 'finished', time: '31 minutes ago' },
  { id: '1234', table: '12', status: 'finished', time: '31 minutes ago' },
];

const ChefScreen = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [finishedOrders, setFinishedOrders] = useState(initialFinishedOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const markOrderDone = () => {
    if (selectedOrder) {
      setFinishedOrders([...finishedOrders, { ...selectedOrder, status: 'finished' }]);
      setOrders(orders.filter((o) => o !== selectedOrder));
      setModalVisible(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../assets/chef.png')} style={styles.iconLarge} />
          <Text style={styles.title}>Chef Dashboard</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.activeOrders}>Active orders: {orders.length}</Text>
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
        {orders.map((order, idx) => (
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
        {finishedOrders.map((order, idx) => (
          <OrderCard key={idx} order={order} />
        ))}
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details - Table #{selectedOrder?.table}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalDetails}>
              <Text style={styles.grayText}>Order #{selectedOrder?.id}</Text>
              <Text style={styles.grayText}>Client client-{selectedOrder?.id}</Text>
              <Text style={[styles.grayText, { marginTop: 10, alignSelf: 'flex-end' }]}>Ordered at 08:02 PM</Text>
              <Text style={[styles.grayText, { alignSelf: 'flex-end' }]}>Status: <Text style={{ color: 'red' }}>In progress</Text></Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCol}>Orders</Text>
              <Text style={styles.headerCol}>Quantity</Text>
            </View>
            {["Grilled Salmon", "Pasta", "Salad"].map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.rowCol}>{item}</Text>
                <Text style={styles.rowCol}>2</Text>
              </View>
            ))}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.doneBtn} onPress={markOrderDone}>
                <Text style={styles.btnText}>Mark Done</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.preparingBtn}>
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
  const isPending = order.status === 'pending';
  const bgColor = isPending ? '#a91c1c' : '#1c7c1c';

  return (
    <View style={[styles.card, { borderTopColor: bgColor }]}>
      <View style={[styles.cardHeader, { backgroundColor: bgColor }]}>
        <Text style={styles.tableText}>Table #{order.table}</Text>
        <View style={styles.orderIdBadge}>
          <Text style={styles.orderIdText}>Order #{order.id}</Text>
        </View>
        <Text style={styles.timeText}>{order.time}</Text>
      </View>
      <View style={styles.cardBody}>
      <Image source={require('../assets/client.png')} style={styles.iconSmall} />
        <Text> Client order</Text>
        <Text style={{ color: '#999', fontSize: 12 }}>4 items</Text>
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
    marginLeft:7,
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
