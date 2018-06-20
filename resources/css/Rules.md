# rules
- Sizes: Only sizes from modular scale & percentage sizes are allowed
- Basline Grid is used for text and height of objects
- Golden Ration (1.618) is used when creating boxes, etc.
- Every page must use the Grid

# naming conventions
- Objects are Uppercase e.g. .Headline
- page specific content is in a seperate pages file and prefix with `page--` + page name, e.g. `page--privcay--headline`
- variables don't have subclasses

# css rules
- only margin-top and margin-left to avoid collapsing margins

# Typography
_based on Modular Scale_
- Base: font-size 20
- Scale: Major thrid (4:5 / 1.25)

# Grid
- 7 inner columns
- 4 outer columns
- 10 gutters

**column:** 20 * 1,25^7 = 95,3674316406
-> 7 columns: 95,3674316406 * 7 = 667,5720214844

**sidebars:** 20 * 1,25^9 = 149,0116119385
-> sidebar column: 149,0116119385/2 = 74,5058059692
-> 4 sidebar columns:  74,5058059692 * 4 = 298,023223877

**gutters overall:** 1200 - 7 columns - 4 sidebar columns = 234,4047546387
-> gutter width: 234,4047546387 / 10 = 23,4404754639

## NUMI:
———————————————
# 7 Inner Colum Layout

column = 20*1,25^7 = 95,3674316406
column as a % of 1200 = 7,9472859701 %
inner = column * 7 = 667,5720214844

sidebars = 20*1,25^9 = 149,0116119385
outer = sidebars * 2 = 298,023223877
sidebar = sidebars/2 = 74,5058059692
sidebar as a % of 1200 = 6,2088171641 %

gutters = 1200 - inner - outer = 234,4047546387
gutter = gutters/10 = 23,4404754639
gutter as a % of 1200 = 1,9533729553 %
