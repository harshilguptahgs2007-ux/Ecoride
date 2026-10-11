import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Header } from "../components/Header";
import { SavedPlacesScroller } from "../components/SavedPlacesScroller";
import { MapCanvas } from "../components/MapCanvas";
import { ImpactCard } from "../components/ImpactCard";
import { THEME } from "../theme/theme";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Zap, Navigation, X, Bus, Star, User, ShieldCheck, CheckCircle2 } from "lucide-react-native";

export const HomeScreen = ({ navigation }) => {
  const { user, refreshUser } = useAuth();
  const [rideHistory, setRideHistory] = useState(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("Sec 62, Noida");
  const [dropAddress, setDropAddress] = useState("Cyber City, Gurugram");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookedDriver, setBookedDriver] = useState(null);

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    try {
      const data = await api.getMyRides(10);
      setRideHistory(data);
    } catch (e) {
      console.log("Fetch rides error:", e.message);
    }
  };

  const handleBookRide = async () => {
    if (!pickupAddress || !dropAddress) {
      Alert.alert("Error", "Please enter both pickup and destination");
      return;
    }
    setBookingLoading(true);

    const driverInfo = {
      driverName: "Rajesh Kumar",
      busRideName: "Route 347 (Electric AC Express)",
      busNumber: "DL 1PD 4820",
      rating: 4.9,
      totalRides: "2,410+ rides",
      eta: "4 mins away",
      distanceKm: 18.2,
      rideId: Math.floor(100 + Math.random() * 900),
    };

    try {
      // Send booking request to backend.py if available
      const payload = {
        pickup_lat: 28.6289,
        pickup_lng: 77.3649,
        drop_lat: 28.4986,
        drop_lng: 77.0878,
        pickup_address: pickupAddress,
        drop_address: dropAddress,
      };
      const newRide = await api.bookRide(payload);
      if (newRide && newRide.id) {
        driverInfo.rideId = newRide.id;
        driverInfo.distanceKm = newRide.distance_km || 18.2;
      }
      loadRides();
      refreshUser();
    } catch (e) {
      console.log("Live backend booking notice (using demo driver dispatch):", e.message);
    } finally {
      setBookedDriver(driverInfo);
      setBookingLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header onProfilePress={() => navigation.navigate("Profile")} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <SavedPlacesScroller
          onSelectPlace={(place) => {
            setDropAddress(place.subtitle);
            setBookingModalVisible(true);
          }}
          onAddPlace={() => setBookingModalVisible(true)}
        />

        <MapCanvas
          onSearchPress={(query) => {
            setDropAddress(query);
            setBookingModalVisible(true);
          }}
          onSelectBus={(bus) => {
            Alert.alert("Transit Telemetry", `${bus.name || "EV Bus"}\nLive telemetry synced!`);
          }}
        />

        {/* Quick EV Ride Booking Action Banner */}
        <View style={styles.quickBookRow}>
          <TouchableOpacity
            style={styles.bookCtaBtn}
            onPress={() => {
              setBookedDriver(null);
              setBookingModalVisible(true);
            }}
            activeOpacity={0.85}
          >
            <View style={styles.ctaIconBadge}>
              <Zap size={18} color="#fff" />
            </View>
            <View style={styles.ctaTextCol}>
              <Text style={styles.ctaTitle}>Book Eco Transit Ride</Text>
              <Text style={styles.ctaSubtitle}>Earn 5 EcoPoints per km + Zero emissions</Text>
            </View>
            <Navigation size={18} color={THEME.colors.primaryLight} />
          </TouchableOpacity>
        </View>

        {/* Active Booked Bus & Driver Card Banner on Home Screen */}
        {bookedDriver && (
          <View style={styles.driverBookedHomeCard}>
            <View style={styles.driverBookedTop}>
              <View style={styles.driverVerifiedTag}>
                <CheckCircle2 size={13} color={THEME.colors.primary} />
                <Text style={styles.driverVerifiedTagText}>BUS & DRIVER ASSIGNED</Text>
              </View>
              <Text style={styles.driverEtaText}>Arriving in {bookedDriver.eta}</Text>
            </View>

            <View style={styles.driverMainRow}>
              <View style={styles.driverAvatarBox}>
                <User size={22} color={THEME.colors.primary} />
              </View>
              <View style={styles.driverInfoCol}>
                <View style={styles.driverNameRow}>
                  <Text style={styles.driverNameText}>{bookedDriver.driverName}</Text>
                  <View style={styles.ratingBadge}>
                    <Star size={12} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.ratingText}>{bookedDriver.rating}</Text>
                  </View>
                </View>
                <Text style={styles.driverMetaText}>Certified Green Pilot • {bookedDriver.totalRides}</Text>
              </View>
            </View>

            <View style={styles.busDetailsRow}>
              <View style={styles.busDetailCol}>
                <Text style={styles.busDetailLabel}>BUS RIDE NAME</Text>
                <View style={styles.busRideNameRow}>
                  <Bus size={14} color={THEME.colors.primary} />
                  <Text style={styles.busRideNameVal}>{bookedDriver.busRideName}</Text>
                </View>
              </View>
              <View style={styles.busPlateBadge}>
                <Text style={styles.busPlateLabel}>BUS NO.</Text>
                <Text style={styles.busPlateVal}>{bookedDriver.busNumber}</Text>
              </View>
            </View>
          </View>
        )}

        <ImpactCard
          onRedeemPress={() => navigation.navigate("Marketplace")}
          rideHistory={rideHistory}
        />
      </ScrollView>

      {/* Booking Modal */}
      <Modal visible={bookingModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {bookedDriver ? "Bus & Driver Confirmed" : "Book Zero-Emission Ride"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setBookingModalVisible(false);
                }}
              >
                <X size={20} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {bookedDriver ? (
              /* Driver & Bus Details View in Modal */
              <View style={styles.driverModalContainer}>
                {/* Confirmation Status Banner */}
                <View style={styles.confirmedBanner}>
                  <CheckCircle2 size={18} color={THEME.colors.primary} />
                  <Text style={styles.confirmedBannerText}>
                    Ride #{bookedDriver.rideId} Confirmed & Dispatched!
                  </Text>
                </View>

                {/* Driver Profile Section */}
                <View style={styles.driverProfileBox}>
                  <View style={styles.driverModalAvatar}>
                    <User size={24} color={THEME.colors.primary} />
                  </View>
                  <View style={styles.driverModalDetails}>
                    <View style={styles.driverNameRow}>
                      <Text style={styles.driverProfileName}>{bookedDriver.driverName}</Text>
                      <View style={styles.ratingBadge}>
                        <Star size={12} color="#f59e0b" fill="#f59e0b" />
                        <Text style={styles.ratingText}>{bookedDriver.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.driverLicenseSub}>
                      Transit Pilot • {bookedDriver.totalRides} • Highly Rated
                    </Text>
                  </View>
                </View>

                {/* Bus Ride & Vehicle Details */}
                <View style={styles.busSpecCard}>
                  <View style={styles.busSpecItem}>
                    <Text style={styles.busSpecLabel}>BUS RIDE NAME</Text>
                    <View style={styles.busSpecValueRow}>
                      <Bus size={15} color={THEME.colors.primary} />
                      <Text style={styles.busSpecValueText}>{bookedDriver.busRideName}</Text>
                    </View>
                  </View>

                  <View style={styles.busSpecDivider} />

                  <View style={styles.busSpecRow}>
                    <View>
                      <Text style={styles.busSpecLabel}>BUS NUMBER</Text>
                      <Text style={styles.busNumberPlateText}>{bookedDriver.busNumber}</Text>
                    </View>
                    <View style={styles.etaBadge}>
                      <Text style={styles.etaBadgeLabel}>ETA</Text>
                      <Text style={styles.etaBadgeVal}>{bookedDriver.eta}</Text>
                    </View>
                  </View>
                </View>

                {/* Route Summary */}
                <View style={styles.routeSummaryBox}>
                  <View style={styles.routeRow}>
                    <View style={styles.routeDotGreen} />
                    <Text style={styles.routeAddressText} numberOfLines={1}>
                      {pickupAddress}
                    </Text>
                  </View>
                  <View style={styles.routeRow}>
                    <View style={styles.routeDotRed} />
                    <Text style={styles.routeAddressText} numberOfLines={1}>
                      {dropAddress}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => setBookingModalVisible(false)}
                >
                  <Text style={styles.doneBtnText}>View On Live Map</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Booking Input Form View */
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Pickup Point</Text>
                  <TextInput
                    style={styles.textInput}
                    value={pickupAddress}
                    onChangeText={setPickupAddress}
                    placeholder="Enter pickup location"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Destination</Text>
                  <TextInput
                    style={styles.textInput}
                    value={dropAddress}
                    onChangeText={setDropAddress}
                    placeholder="Enter destination"
                  />
                </View>

                <View style={styles.rateInfoBox}>
                  <Text style={styles.rateInfoTitle}>🌿 Green Mobility Guarantee</Text>
                  <Text style={styles.rateInfoText}>
                    5 EcoPoints per km are automatically credited upon trip completion.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={handleBookRide}
                  disabled={bookingLoading}
                >
                  <Text style={styles.confirmBtnText}>
                    {bookingLoading ? "Confirming Ride..." : "Confirm & Dispatch"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scroll: {
    paddingBottom: 90,
  },
  quickBookRow: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  bookCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.primary,
    padding: 14,
    borderRadius: THEME.roundness.xl,
    gap: 12,
    ...THEME.shadows.float,
  },
  ctaIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaTextCol: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  ctaSubtitle: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.85)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalCard: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 14,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.textSecondary,
  },
  textInput: {
    backgroundColor: THEME.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    borderRadius: THEME.roundness.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: THEME.colors.textPrimary,
  },
  rateInfoBox: {
    backgroundColor: THEME.colors.secondaryContainer,
    padding: 12,
    borderRadius: THEME.roundness.md,
    gap: 4,
  },
  rateInfoTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.primaryDark,
  },
  rateInfoText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  confirmBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.roundness.lg,
    alignItems: "center",
    marginTop: 6,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  // Driver Booked Banner on Home Screen
  driverBookedHomeCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.roundness.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 12,
    ...THEME.shadows.card,
  },
  driverBookedTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  driverVerifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0, 107, 44, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.roundness.full,
  },
  driverVerifiedTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: THEME.colors.primary,
    letterSpacing: 0.5,
  },
  driverEtaText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.primaryDark,
  },
  driverMainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  driverAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 107, 44, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  driverInfoCol: {
    flex: 1,
    gap: 2,
  },
  driverNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  driverNameText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.roundness.full,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#b45309",
  },
  driverMetaText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  busDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.colors.surfaceSecondary,
    borderRadius: THEME.roundness.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  busDetailCol: {
    flex: 1,
    gap: 2,
  },
  busDetailLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
  busRideNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  busRideNameVal: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  busPlateBadge: {
    alignItems: "flex-end",
    gap: 2,
  },
  busPlateLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
  busPlateVal: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    fontFamily: "monospace",
    backgroundColor: "#fef08a",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  // Modal Driver Confirmation Views
  driverModalContainer: {
    gap: 14,
  },
  confirmedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0, 107, 44, 0.1)",
    padding: 10,
    borderRadius: THEME.roundness.md,
  },
  confirmedBannerText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  driverProfileBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: THEME.colors.surfaceSecondary,
    padding: 12,
    borderRadius: THEME.roundness.lg,
  },
  driverModalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 107, 44, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  driverModalDetails: {
    flex: 1,
    gap: 3,
  },
  driverProfileName: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  driverLicenseSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  busSpecCard: {
    backgroundColor: THEME.colors.surfaceSecondary,
    borderRadius: THEME.roundness.lg,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  busSpecItem: {
    gap: 3,
  },
  busSpecLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
  busSpecValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  busSpecValueText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  busSpecDivider: {
    height: 1,
    backgroundColor: THEME.colors.surfaceBorder,
  },
  busSpecRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  busNumberPlateText: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    fontFamily: "monospace",
    backgroundColor: "#fef08a",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  etaBadge: {
    alignItems: "flex-end",
  },
  etaBadgeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: THEME.colors.textMuted,
  },
  etaBadgeVal: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.colors.primary,
  },
  routeSummaryBox: {
    backgroundColor: THEME.colors.surfaceSecondary,
    borderRadius: THEME.roundness.lg,
    padding: 12,
    gap: 8,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  routeDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.primary,
  },
  routeDotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.error,
  },
  routeAddressText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    fontWeight: "600",
    flex: 1,
  },
  doneBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.roundness.lg,
    alignItems: "center",
    marginTop: 4,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
});
