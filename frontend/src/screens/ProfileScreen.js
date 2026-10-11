import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  Linking,
} from "react-native";
import { THEME } from "../theme/theme";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import {
  CheckCircle2,
  Leaf,
  Phone,
  MapPin,
  ChevronRight,
  ChevronDown,
  PiggyBank,
  Bus,
  Home,
  Zap,
  Bell,
  Headphones,
  LogOut,
  Target,
  Sparkles,
  Award,
  ShieldCheck,
  ArrowRight,
  Mail,
  MessageSquare,
  Copy,
} from "lucide-react-native";

export const ProfileScreen = () => {
  const { user } = useAuth();
  const [autoRedeem, setAutoRedeem] = useState(true);
  const [showPerks, setShowPerks] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "EcoRide Log Out",
      "You are in demo mode. All data is stored locally and in your live backend.",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Delight Card with Biophilic Accents */}
        <View style={styles.delightCard}>
          {/* Ambient Glow Bubbles */}
          <View style={styles.ambientGlowTop} />
          <View style={styles.ambientGlowBottom} />

          <View style={styles.headerUserRow}>
            {/* Avatar with Verified Green Badge */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarBorder}>
                <Image
                  source={{
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJWliLsuGRHFHGij2X10zMkErLuxrTgjQtbshlta1Nq6mEIMmY_-gT28CLGQ2vYislRZjhnV9vjiHho531-6sp9kOIlrg82A-azz-67rPmu7Oa6ux-Hg_5o9yP7SlbzRynzOrmdSMZ36mjGrvMejU26Of6vUZAcE81kQfb3Dd_dH6s_ZXXxhieJGBasYBVDP2qR9U9vxKyER1Vpjs2kN2RxHgK3O-IAf4Kdqp90cWxkGm71O-xC4V1Wg",
                  }}
                  style={styles.avatarImage}
                />
              </View>
              <View style={styles.verifiedBadge}>
                <CheckCircle2 size={13} color="#ffffff" />
              </View>
            </View>

            {/* User Info & Metadata */}
            <View style={styles.userInfoCol}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>
                  {user?.username === "alex_commuter" ? "Priya Sharma" : user?.username || "Priya Sharma"}
                </Text>
                <Leaf size={16} color={THEME.colors.primary} />
              </View>

              <View style={styles.phoneRow}>
                <Phone size={12} color={THEME.colors.textSecondary} />
                <Text style={styles.phoneText}>{user?.contact || "+91 98765 43210"}</Text>
              </View>

              <View style={styles.commuterCityPill}>
                <MapPin size={11} color={THEME.colors.secondary} />
                <Text style={styles.commuterCityText}>Delhi NCR Commuter</Text>
              </View>
            </View>
          </View>

          {/* Active Impact Ribbon */}
          <View style={styles.impactRibbon}>
            <View style={styles.ribbonLeft}>
              <View style={styles.pulseDot} />
              <Text style={styles.ribbonTierText}>
                Transit Tier: <Text style={styles.ribbonTierBold}>Forest Sentinel</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={styles.perksBtn}
              onPress={() => setShowPerks((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Text style={styles.perksText}>
                {showPerks ? "Hide Perks" : "View Perks"}
              </Text>
              {showPerks ? (
                <ChevronDown size={14} color={THEME.colors.secondary} />
              ) : (
                <ChevronRight size={14} color={THEME.colors.secondary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Interactive Perks & Target Tier Roadmap with Arrow Indicators */}
          {showPerks && (
            <View style={styles.perksTargetPanel}>
              {/* Header info with Target icon */}
              <View style={styles.perksPanelHeader}>
                <View style={styles.targetIconCircle}>
                  <Target size={16} color={THEME.colors.primary} />
                </View>
                <View style={styles.targetHeaderTexts}>
                  <Text style={styles.targetPanelTitle}>Current Tier Perks & Next Targets</Text>
                  <Text style={styles.targetPanelSubtitle}>
                    Earn 80 more pts to unlock Tier 4 Eco-Ambassador
                  </Text>
                </View>
              </View>

              {/* Target Milestones Road with Directional Arrow */}
              <View style={styles.milestonesRoad}>
                {/* Step 1: Active Tier */}
                <View style={styles.milestoneItem}>
                  <View style={styles.milestoneBadgeActive}>
                    <ShieldCheck size={14} color="#ffffff" />
                    <Text style={styles.milestoneBadgeTextActive}>Forest Sentinel (Active)</Text>
                  </View>
                  <Text style={styles.milestonePerkDesc}>
                    ✓ 1.25x EcoPoints multiplier on all EV rides
                  </Text>
                  <Text style={styles.milestonePerkDesc}>
                    ✓ Priority boarding access on electric corridors
                  </Text>
                </View>

                {/* Directional Target Arrow Connector */}
                <View style={styles.targetArrowConnector}>
                  <View style={styles.targetArrowLine} />
                  <View style={styles.targetArrowBadge}>
                    <Text style={styles.targetArrowLabel}>NEXT TARGET</Text>
                    <ArrowRight size={14} color={THEME.colors.primary} />
                  </View>
                  <View style={styles.targetArrowLine} />
                </View>

                {/* Step 2: Next Target Tier */}
                <View style={styles.milestoneItemTarget}>
                  <View style={styles.milestoneBadgeTarget}>
                    <Award size={14} color={THEME.colors.tertiaryDark} />
                    <Text style={styles.milestoneBadgeTextTarget}>Target: Eco-Ambassador (500 pts)</Text>
                  </View>
                  <Text style={styles.targetPerkDesc}>
                    → 1.5x EcoPoints multiplier + 2 free monthly ride passes
                  </Text>
                  <Text style={styles.targetPerkDesc}>
                    → Exclusive invitations to zero-carbon tree-plantation drives
                  </Text>

                  {/* Progress Bar towards target */}
                  <View style={styles.targetProgressBarTrack}>
                    <View style={[styles.targetProgressBarFill, { width: "84%" }]} />
                  </View>
                  <View style={styles.targetProgressFooter}>
                    <Text style={styles.targetProgressText}>420 / 500 EcoPoints (84%)</Text>
                    <Text style={styles.targetPtsRemaining}>80 pts needed 🎯</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Commuter Stats Bento Summary (3-Column Grid) */}
        <View style={styles.bentoGrid}>
          {/* Stat 1: EcoPoints */}
          <View style={styles.bentoCard}>
            <View style={[styles.bentoIconCircle, { backgroundColor: THEME.colors.tertiaryLight }]}>
              <PiggyBank size={18} color={THEME.colors.tertiary} />
            </View>
            <Text style={styles.bentoNumber}>{user?.eco_points_total || 420}</Text>
            <Text style={styles.bentoLabel}>EcoPoints</Text>
            <View style={[styles.bentoBadge, { backgroundColor: "rgba(117, 88, 0, 0.1)" }]}>
              <Text style={[styles.bentoBadgeText, { color: THEME.colors.tertiaryDark }]}>Tier 3</Text>
            </View>
          </View>

          {/* Stat 2: Total Rides */}
          <View style={styles.bentoCard}>
            <View style={[styles.bentoIconCircle, { backgroundColor: THEME.colors.secondaryContainer }]}>
              <Bus size={18} color={THEME.colors.secondary} />
            </View>
            <Text style={styles.bentoNumber}>38</Text>
            <Text style={styles.bentoLabel}>Total Rides</Text>
            <View style={[styles.bentoBadge, { backgroundColor: THEME.colors.surfaceSecondary }]}>
              <Text style={[styles.bentoBadgeText, { color: THEME.colors.secondary }]}>Clean Transit</Text>
            </View>
          </View>

          {/* Stat 3: CO2 Saved */}
          <View style={styles.bentoCard}>
            <View style={[styles.bentoIconCircle, { backgroundColor: THEME.colors.primaryLight }]}>
              <Leaf size={18} color={THEME.colors.primaryDark} />
            </View>
            <Text style={[styles.bentoNumber, { color: THEME.colors.primary }]}>
              54.2<Text style={styles.unitText}>kg</Text>
            </Text>
            <Text style={styles.bentoLabel}>CO₂ Saved</Text>
            <View style={[styles.bentoBadge, { backgroundColor: THEME.colors.surfaceSecondary }]}>
              <Text style={[styles.bentoBadgeText, { color: THEME.colors.primary }]}>~3 Trees</Text>
            </View>
          </View>
        </View>

        {/* EcoPoint Auto-Redemption Banner */}
        <View style={styles.autoRedeemBanner}>
          <View style={styles.autoRedeemLeft}>
            <View style={[styles.bentoIconCircle, { backgroundColor: THEME.colors.tertiaryLight }]}>
              <Zap size={18} color={THEME.colors.tertiary} />
            </View>
            <View>
              <Text style={styles.autoRedeemTitle}>Auto-Redemption Active</Text>
              <Text style={styles.autoRedeemSub}>Redeem EcoPoints during checkout</Text>
            </View>
          </View>
          <Switch
            value={autoRedeem}
            onValueChange={setAutoRedeem}
            trackColor={{ false: THEME.colors.surfaceBorder, true: THEME.colors.primaryLight }}
            thumbColor={autoRedeem ? THEME.colors.primary : "#f4f3f4"}
          />
        </View>


        {/* Section 1: Commute Preferences & Essentials */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>COMMUTE PREFERENCES & ESSENTIALS</Text>
          <View style={styles.menuGroup}>
            {/* Saved Places */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={[styles.menuIconBox, { backgroundColor: THEME.colors.surfaceSecondary }]}>
                <Home size={19} color={THEME.colors.secondary} />
              </View>
              <View style={styles.menuItemBody}>
                <View style={styles.menuItemHeader}>
                  <Text style={styles.menuItemTitle}>Saved Places</Text>
                  <View style={[styles.miniBadge, { backgroundColor: THEME.colors.secondaryLight }]}>
                    <Text style={[styles.miniBadgeText, { color: THEME.colors.secondary }]}>3 saved</Text>
                  </View>
                </View>
                <Text style={styles.menuItemSub}>Home, Work, 3 places saved</Text>
              </View>
              <ChevronRight size={18} color={THEME.colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Ride Preferences */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={[styles.menuIconBox, { backgroundColor: THEME.colors.surfaceSecondary }]}>
                <Zap size={19} color={THEME.colors.primary} />
              </View>
              <View style={styles.menuItemBody}>
                <View style={styles.menuItemHeader}>
                  <Text style={styles.menuItemTitle}>Ride Preferences</Text>
                  <View style={[styles.miniBadge, { backgroundColor: THEME.colors.primaryLight }]}>
                    <Text style={[styles.miniBadgeText, { color: THEME.colors.primaryDark }]}>EV Only</Text>
                  </View>
                </View>
                <Text style={styles.menuItemSub}>Electric/AC bus priority, quiet commute</Text>
              </View>
              <ChevronRight size={18} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 2: Support & Notifications */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>SUPPORT & NOTIFICATIONS</Text>
          <View style={styles.menuGroup}>
            {/* Notifications */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={[styles.menuIconBox, { backgroundColor: THEME.colors.surfaceSecondary }]}>
                <Bell size={19} color={THEME.colors.secondary} />
              </View>
              <View style={styles.menuItemBody}>
                <View style={styles.menuItemHeader}>
                  <Text style={styles.menuItemTitle}>Notifications</Text>
                  <View style={styles.notificationDot} />
                </View>
                <Text style={styles.menuItemSub}>Live bus arrival alerts enabled</Text>
              </View>
              <ChevronRight size={18} color={THEME.colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Help & Support */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowSupport((prev) => !prev)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: THEME.colors.surfaceSecondary }]}>
                <Headphones size={19} color={THEME.colors.secondary} />
              </View>
              <View style={styles.menuItemBody}>
                <Text style={styles.menuItemTitle}>Help & Support</Text>
                <Text style={styles.menuItemSub}>24x7 Transit Helpline, Email & SMS</Text>
              </View>
              {showSupport ? (
                <ChevronDown size={18} color={THEME.colors.secondary} />
              ) : (
                <ChevronRight size={18} color={THEME.colors.textMuted} />
              )}
            </TouchableOpacity>

            {/* Expandable Support Channels Box */}
            {showSupport && (
              <View style={styles.supportChannelsContainer}>
                {/* Channel 1: 24x7 Transit Helpline Phone */}
                <View style={styles.supportChannelCard}>
                  <View style={styles.supportChannelIconCircle}>
                    <Phone size={18} color={THEME.colors.primary} />
                  </View>
                  <View style={styles.supportChannelInfo}>
                    <Text style={styles.supportChannelLabel}>24x7 TRANSIT HELPLINE</Text>
                    <Text style={styles.supportChannelValue}>1800-200-ZAPB (1800 200 9272)</Text>
                    <Text style={styles.supportChannelSub}>Toll-free emergency & bus dispatch support</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.supportActionBtn}
                    onPress={() => Linking.openURL("tel:18002009272")}
                    activeOpacity={0.8}
                  >
                    <Phone size={13} color="#ffffff" />
                    <Text style={styles.supportActionBtnText}>Call</Text>
                  </TouchableOpacity>
                </View>

                {/* Channel 2: Official Support Email */}
                <View style={styles.supportChannelCard}>
                  <View style={styles.supportChannelIconCircle}>
                    <Mail size={18} color={THEME.colors.secondary} />
                  </View>
                  <View style={styles.supportChannelInfo}>
                    <Text style={styles.supportChannelLabel}>EMAIL SUPPORT</Text>
                    <Text style={styles.supportChannelValue}>support@zapbus.in</Text>
                    <Text style={styles.supportChannelSub}>Response within 2 hours for grievances</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.supportActionBtn, { backgroundColor: THEME.colors.secondary }]}
                    onPress={() => Linking.openURL("mailto:support@zapbus.in?subject=ZapBus Support Query")}
                    activeOpacity={0.8}
                  >
                    <Mail size={13} color="#ffffff" />
                    <Text style={styles.supportActionBtnText}>Email</Text>
                  </TouchableOpacity>
                </View>

                {/* Channel 3: SMS Helpline / Shortcode */}
                <View style={styles.supportChannelCard}>
                  <View style={styles.supportChannelIconCircle}>
                    <MessageSquare size={18} color={THEME.colors.tertiaryDark} />
                  </View>
                  <View style={styles.supportChannelInfo}>
                    <Text style={styles.supportChannelLabel}>SMS HELPLINE & SOS</Text>
                    <Text style={styles.supportChannelValue}>+91 98710 92728 (or SMS HELP)</Text>
                    <Text style={styles.supportChannelSub}>Instant SMS updates on delay & lost items</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.supportActionBtn, { backgroundColor: THEME.colors.tertiaryDark }]}
                    onPress={() => Linking.openURL("sms:+919871092728?body=HELP ZapBus")}
                    activeOpacity={0.8}
                  >
                    <MessageSquare size={13} color="#ffffff" />
                    <Text style={styles.supportActionBtnText}>SMS</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Log Out Action Card */}
        <TouchableOpacity
          style={styles.logoutCard}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={styles.logoutIconBox}>
            <LogOut size={19} color={THEME.colors.error} />
          </View>
          <View style={styles.menuItemBody}>
            <Text style={styles.logoutTitle}>Log Out of EcoRide</Text>
            <Text style={styles.menuItemSub}>
              Signed in as Priya Sharma (+91 98765 43210)
            </Text>
          </View>
          <ChevronRight size={18} color={THEME.colors.error} />
        </TouchableOpacity>

        {/* App Info Footer with Subtle Green Identity */}
        <View style={styles.footerContainer}>
          <View style={styles.footerBrandRow}>
            <Leaf size={14} color={THEME.colors.primary} />
            <Text style={styles.footerBrandText}>ECORIDE DELHI NCR NETWORK</Text>
          </View>
          <Text style={styles.footerVersionText}>
            EcoRide v2.4.0 • Made for clean public transit in Delhi NCR
          </Text>
          <View style={styles.footerLinksRow}>
            <Text style={styles.footerLink}>Terms of Service</Text>
            <View style={styles.dotBullet} />
            <Text style={styles.footerLink}>Privacy Policy</Text>
            <View style={styles.dotBullet} />
            <Text style={styles.footerLink}>Green Report</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 14,
  },
  delightCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.roundness.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    overflow: "hidden",
    position: "relative",
    ...THEME.shadows.card,
  },
  ambientGlowTop: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(156, 242, 232, 0.4)",
  },
  ambientGlowBottom: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(127, 252, 151, 0.3)",
  },
  headerUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarBorder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 2,
    backgroundColor: THEME.colors.primary,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 34,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfoCol: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  phoneText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  commuterCityPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    backgroundColor: THEME.colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.roundness.full,
    marginTop: 6,
  },
  commuterCityText: {
    fontSize: 10,
    fontWeight: "700",
    color: THEME.colors.secondary,
  },
  impactRibbon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.colors.surfaceSecondary,
    borderRadius: THEME.roundness.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 14,
  },
  ribbonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.primary,
  },
  ribbonTierText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
  },
  ribbonTierBold: {
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  perksBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  perksText: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.colors.secondary,
  },
  perksTargetPanel: {
    marginTop: 12,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.roundness.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 12,
    ...THEME.shadows.card,
  },
  perksPanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  targetIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 107, 44, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  targetHeaderTexts: {
    flex: 1,
  },
  targetPanelTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  targetPanelSubtitle: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  milestonesRoad: {
    gap: 10,
  },
  milestoneItem: {
    backgroundColor: THEME.colors.surfaceSecondary,
    borderRadius: THEME.roundness.md,
    padding: 10,
    gap: 5,
  },
  milestoneBadgeActive: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.roundness.full,
    marginBottom: 2,
  },
  milestoneBadgeTextActive: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
  },
  milestonePerkDesc: {
    fontSize: 11,
    color: THEME.colors.textPrimary,
    lineHeight: 16,
  },
  targetArrowConnector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginVertical: 2,
  },
  targetArrowLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.surfaceBorder,
  },
  targetArrowBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0, 107, 44, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.roundness.full,
    borderWidth: 1,
    borderColor: "rgba(0, 107, 44, 0.2)",
  },
  targetArrowLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: THEME.colors.primary,
    letterSpacing: 0.5,
  },
  milestoneItemTarget: {
    backgroundColor: "rgba(117, 88, 0, 0.06)",
    borderRadius: THEME.roundness.md,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(117, 88, 0, 0.2)",
    gap: 6,
  },
  milestoneBadgeTarget: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    backgroundColor: "rgba(117, 88, 0, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.roundness.full,
  },
  milestoneBadgeTextTarget: {
    fontSize: 10,
    fontWeight: "700",
    color: THEME.colors.tertiaryDark,
  },
  targetPerkDesc: {
    fontSize: 11,
    color: THEME.colors.textPrimary,
    lineHeight: 16,
  },
  targetProgressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    marginTop: 4,
  },
  targetProgressBarFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: THEME.colors.tertiaryDark,
  },
  targetProgressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  targetProgressText: {
    fontSize: 10,
    fontWeight: "600",
    color: THEME.colors.textSecondary,
  },
  targetPtsRemaining: {
    fontSize: 10,
    fontWeight: "700",
    color: THEME.colors.tertiaryDark,
  },
  bentoGrid: {
    flexDirection: "row",
    gap: 8,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.roundness.lg,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    ...THEME.shadows.card,
  },
  bentoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  bentoNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  unitText: {
    fontSize: 11,
    fontWeight: "400",
  },
  bentoLabel: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  bentoBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.roundness.full,
    marginTop: 6,
  },
  bentoBadgeText: {
    fontSize: 9,
    fontWeight: "700",
  },
  autoRedeemBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.roundness.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    ...THEME.shadows.card,
  },
  autoRedeemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  autoRedeemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: THEME.colors.textPrimary,
  },
  autoRedeemSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  menuSection: {
    gap: 6,
  },
  menuSectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.textMuted,
    paddingHorizontal: 4,
    letterSpacing: 0.5,
  },
  menuGroup: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.roundness.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    overflow: "hidden",
    ...THEME.shadows.card,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: THEME.roundness.md,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemBody: {
    flex: 1,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: THEME.colors.textPrimary,
  },
  miniBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.roundness.full,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  notificationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.primary,
  },
  menuItemSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.surfaceBorder,
    marginLeft: 60,
  },
  logoutCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.roundness.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 12,
    ...THEME.shadows.card,
  },
  logoutIconBox: {
    width: 36,
    height: 36,
    borderRadius: THEME.roundness.md,
    backgroundColor: THEME.colors.errorLight,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.error,
  },
  footerContainer: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
    gap: 4,
  },
  footerBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerBrandText: {
    fontSize: 10,
    fontWeight: "700",
    color: THEME.colors.textMuted,
    letterSpacing: 0.8,
  },
  footerVersionText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    textAlign: "center",
  },
  footerLinksRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  footerLink: {
    fontSize: 11,
    color: THEME.colors.secondary,
    fontWeight: "600",
  },
  dotBullet: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: THEME.colors.surfaceBorder,
  },
  // Support Channels Container Styles
  supportChannelsContainer: {
    backgroundColor: THEME.colors.surfaceSecondary,
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
  },
  supportChannelCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    padding: 12,
    borderRadius: THEME.roundness.md,
    gap: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    ...THEME.shadows.card,
  },
  supportChannelIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0, 107, 44, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  supportChannelInfo: {
    flex: 1,
    gap: 2,
  },
  supportChannelLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
  supportChannelValue: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  supportChannelSub: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
  },
  supportActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: THEME.roundness.sm,
  },
  supportActionBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
});
